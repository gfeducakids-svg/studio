
import 'server-only';
import { NextResponse } from "next/server";
import { adminAuth, db } from "@/lib/firebaseAdmin";
import { FieldPath } from "firebase-admin/firestore";

function normalizeEmail(email: string): string {
  let e = (email || "").trim().toLowerCase();
  const [local, domain] = e.split("@");
  if (!local || !domain) return e;

  if (domain === "gmail.com" || domain === "googlemail.com") {
    const noPlus = local.split("+")[0];
    const noDots = noPlus.replace(/\./g, "");
    e = `${noDots}@gmail.com`;
  } else {
    e = `${local}@${domain}`;
  }
  return e;
}

// Garante que a rota seja dinâmica e revalidada a cada requisição
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization") || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

    if (!token) {
      console.log("Apply-pending: No token provided.");
      return NextResponse.json({ ok: false, error: "no_token" }, { status: 401 });
    }

    const decoded = await adminAuth.verifyIdToken(token);
    const uid = decoded.uid;
    const email = decoded.email || "";
    const emailNorm = normalizeEmail(email);

    if (!emailNorm) {
        console.log(`Apply-pending: User ${uid} has no email.`);
        return NextResponse.json({ ok: false, error: "no_email" }, { status: 400 });
    }
    
    console.log(`Apply-pending: Processing for UID ${uid}, email ${emailNorm}`);

    const pendingRef = db.collection("pending_purchases").doc(emailNorm);
    const userRef = db.collection("users").doc(uid);

    let applied = false;
    let appliedModules: string[] = [];

    await db.runTransaction(async (tx) => {
      const [pSnap, uSnap] = await Promise.all([tx.get(pendingRef), tx.get(userRef)]);
      
      if (!pSnap.exists) {
        console.log(`Apply-pending: No pending purchases for ${emailNorm}.`);
        return; // Sai da transação se não houver pendências
      }
      
      console.log(`Apply-pending: Found pending purchase for ${emailNorm}.`);

      const raw = pSnap.data()?.modules;
      let modules: string[] = [];
      if (Array.isArray(raw)) modules = raw.map(String).filter(Boolean);
      else if (raw && typeof raw === "object") modules = Object.keys(raw).filter(key => raw[key]).map(String).filter(Boolean);
      else if (typeof raw === "string") modules = [raw].filter(Boolean);

      if (modules.length === 0) {
        console.warn(`Apply-pending: Pending document for ${emailNorm} exists but has no valid modules. Deleting.`);
        tx.delete(pendingRef); // Limpa o documento inválido
        return;
      }

      if (!uSnap.exists) {
        console.log(`Apply-pending: User document for ${uid} does not exist. Creating it.`);
        tx.set(userRef, { email, progress: {} }, { merge: true });
      }

      console.log(`Apply-pending: Unlocking modules [${modules.join(', ')}] for user ${uid}.`);
      for (const m of modules) {
        tx.update(userRef, new FieldPath("progress", m, "status"), "unlocked");
         // Regra especial para o primeiro submódulo do grafismo
        if (m === 'grafismo-fonetico') {
            const introField = new FieldPath("progress", m, "submodules", "intro", "status");
            tx.update(userRef, introField, "unlocked");
        }
      }

      console.log(`Apply-pending: Deleting pending document for ${emailNorm}.`);
      tx.delete(pendingRef);
      
      applied = true;
      appliedModules = modules;
    });

    console.log(`Apply-pending: Transaction completed for ${emailNorm}. Applied: ${applied}`);
    return NextResponse.json({ ok: true, applied, modules: appliedModules }, { status: 200 });

  } catch (e: any) {
    if (e.code === 'auth/id-token-expired' || e.code === 'auth/argument-error') {
        console.warn("Apply-pending auth error:", e.code);
        return NextResponse.json({ ok: false, error: "invalid_token" }, { status: 401 });
    }
    console.error("Apply-pending internal error:", e);
    return NextResponse.json({ ok: false, error: "internal_error" }, { status: 500 });
  }
}

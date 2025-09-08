
import 'server-only';
import {NextResponse} from 'next/server';
import {getAuth} from 'firebase-admin/auth';
import nodemailer from 'nodemailer';
import {initAdmin, makeTransportGmail} from '@/lib/diag';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    // Inicializa o Admin SDK (seguro, só executa uma vez)
    initAdmin();

    const {email} = await req.json();
    if (!email || typeof email !== 'string') {
      return NextResponse.json({
        ok: false,
        error: {message: 'E-mail inválido fornecido.'},
      }, {status: 400});
    }

    // Tenta buscar o usuário primeiro para fornecer um erro claro se ele não existir
    try {
      await getAuth().getUserByEmail(email);
    } catch (e: any) {
      if (e.code === 'auth/user-not-found') {
        console.warn(`Tentativa de reset para e-mail não cadastrado: ${email}`);
        return NextResponse.json({
          ok: false,
          error: {
            code: e.code,
            message: 'Este e-mail não está cadastrado em nosso banco de dados.',
            source: 'admin',
          },
        }, {status: 404});
      }
      // Lança outros erros do admin para o catch principal
      throw e;
    }

    // Gera o link de redefinição de senha
    const link = await getAuth().generatePasswordResetLink(email, {
      url: process.env.RESET_REDIRECT_URL || `${new URL(req.url).origin}/reset-password`,
      handleCodeInApp: true,
    });

    // Envia o e-mail
    const transporter = makeTransportGmail();
    const info = await transporter.sendMail({
      from: `"EducaKids" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: 'Redefina sua senha na plataforma EducaKids',
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #04123C;">Redefinição de Senha</h2>
          <p>Olá!</p>
          <p>Recebemos uma solicitação para redefinir a senha da sua conta. Se foi você, clique no botão abaixo para criar uma nova senha:</p>
          <p style="text-align: center; margin: 20px 0;">
            <a href="${link}" style="background-color: #24A9F4; color: white; padding: 12px 20px; text-decoration: none; border-radius: 25px; font-weight: bold;">Redefinir Senha</a>
          </p>
          <p>Se você não solicitou a redefinição, pode ignorar este e-mail.</p>
          <p>Atenciosamente,<br>Equipe EducaKids</p>
        </div>
      `,
    });

    return NextResponse.json({ok: true, messageId: info.messageId}, {status: 200});
  } catch (e: any) {
    console.error('SEND-RESET ERROR:', e);
    const source = e.code?.startsWith('auth/') ? 'admin' : e.code ? 'smtp' : 'unknown';

    return NextResponse.json({
      ok: false,
      error: {
        code: e.code,
        message: e.message,
        source,
      },
    }, {status: 500});
  }
}

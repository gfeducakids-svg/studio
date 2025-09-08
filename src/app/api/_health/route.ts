
import 'server-only';
import {NextResponse} from 'next/server';
import nodemailer from 'nodemailer';
import {getAuth} from 'firebase-admin/auth';
import {assertEnv, initAdmin, makeTransportGmail} from '@/lib/diag';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  // 1. Verificar Variáveis de Ambiente
  const {ok: envOk, missing} = assertEnv([
    'GMAIL_USER',
    'GMAIL_APP_PASS',
    'FIREBASE_SERVICE_ACCOUNT',
    'RESET_REDIRECT_URL',
  ]);
  const envCheck = {
    has_GMAIL_USER: !missing.includes('GMAIL_USER'),
    has_GMAIL_APP_PASS: !missing.includes('GMAIL_APP_PASS'),
    has_FIREBASE_SERVICE_ACCOUNT: !missing.includes('FIREBASE_SERVICE_ACCOUNT'),
    has_RESET_REDIRECT_URL: !missing.includes('RESET_REDIRECT_URL'),
  };

  if (!envOk) {
    return NextResponse.json({
      envs: envCheck,
      smtp: {ok: false, message: `Variáveis de ambiente faltando: ${missing.join(', ')}`},
      admin: {ok: false, message: 'Não verificado devido a envs faltando.'},
      meta: {runtime: 'nodejs', timestamp: new Date().toISOString()},
    });
  }

  // 2. Testar Conexão SMTP com o Gmail
  const smtpCheck: any = {ok: true, step: ''};
  try {
    const transporter = makeTransportGmail();
    smtpCheck.step = 'verify';
    await transporter.verify();

    smtpCheck.step = 'send';
    const info = await transporter.sendMail({
      from: `EducaKids <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      subject: 'Diagnóstico SMTP EducaKids OK',
      text: 'Ping! A conexão com o servidor de e-mail do Gmail está funcionando.',
    });
    smtpCheck.messageId = info.messageId;
  } catch (e: any) {
    smtpCheck.ok = false;
    smtpCheck.code = e.code;
    smtpCheck.message = e.message;
    if (e.code === 'EAUTH') {
      smtpCheck.hint = 'GMAIL_APP_PASS pode estar inválido. Verifique se a 2FA está ativa e se a senha de app foi gerada e copiada corretamente. O e-mail em "from" deve ser o mesmo de GMAIL_USER.';
    } else if (e.code === 'ENOTFOUND' || e.code === 'ECONNREFUSED') {
      smtpCheck.hint = 'Não foi possível conectar ao servidor SMTP do Gmail. Verifique a conexão de rede ou possíveis bloqueios de firewall.';
    } else {
      smtpCheck.hint = 'Ocorreu um erro inesperado na comunicação com o Gmail.';
    }
  }

  // 3. Testar Firebase Admin SDK
  const adminCheck: any = {ok: true};
  try {
    initAdmin(); // Garante que está inicializado
    adminCheck.sampleLink = await getAuth().generatePasswordResetLink(
      process.env.GMAIL_USER!,
      {
        url: process.env.RESET_REDIRECT_URL!,
        handleCodeInApp: true,
      }
    );
  } catch (e: any) {
    adminCheck.ok = false;
    adminCheck.code = e.code;
    adminCheck.message = e.message;
    if (e.code === 'auth/user-not-found') {
      adminCheck.hint = `O usuário de teste (${process.env.GMAIL_USER}) não existe no Firebase Auth. Crie-o para um diagnóstico completo.`;
    } else if (e.message.includes('JSON')) {
      adminCheck.hint = 'O JSON em FIREBASE_SERVICE_ACCOUNT parece ser inválido. Copie o conteúdo completo do arquivo, sem aspas extras, e cole na variável de ambiente.';
    } else {
      adminCheck.hint = 'Erro ao inicializar o Admin SDK ou gerar o link. Verifique as credenciais.';
    }
  }

  return NextResponse.json({
    envs: envCheck,
    smtp: smtpCheck,
    admin: adminCheck,
    meta: {
      runtime: 'nodejs',
      timestamp: new Date().toISOString(),
    },
  });
}

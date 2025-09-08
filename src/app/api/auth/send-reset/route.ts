
import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import nodemailer from 'nodemailer';
import { adminAuth } from '@/lib/firebaseAdmin'; // Importa a auth inicializada

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// O Admin SDK é inicializado em @/lib/firebaseAdmin.ts, aqui apenas usamos a instância.
const auth = adminAuth;

// Configura o transporter do Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASS, // Senha de App do Gmail
  },
});

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email inválido fornecido.' }, { status: 400 });
    }

    // Busca o nome do usuário no Firebase Auth para personalizar o e-mail
    let userName = '';
    try {
        const userRecord = await auth.getUserByEmail(email);
        userName = userRecord.displayName || '';
    } catch (error: any) {
        // Se o usuário não for encontrado, não tratamos como um erro fatal.
        // Apenas enviamos o e-mail sem o nome.
        if (error.code !== 'auth/user-not-found') {
            throw error; // Lança outros erros para o catch principal
        }
        console.log(`Tentativa de reset para e-mail não cadastrado: ${email}`);
    }

    // Gera o link de redefinição de senha
    const actionCodeSettings = {
        url: process.env.RESET_REDIRECT_URL || `${req.nextUrl.origin}/reset-password`, // URL para a página de redefinição
        handleCodeInApp: true,
    };
    const link = await auth.generatePasswordResetLink(email, actionCodeSettings);

    // Monta o e-mail
    const mailOptions = {
      from: `"EducaKids" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: 'Redefina sua senha na plataforma EducaKids',
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
            <h2 style="color: #04123C; text-align: center;">Redefinição de Senha</h2>
            <p>Olá${userName ? `, ${userName}` : ''}!</p>
            <p>Recebemos uma solicitação para redefinir a senha da sua conta na plataforma EducaKids. Se foi você, clique no botão abaixo para criar uma nova senha:</p>
            <p style="text-align: center; margin: 30px 0;">
              <a href="${link}" style="background-color: #24A9F4; color: white; padding: 12px 25px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">Redefinir Senha</a>
            </p>
            <p>Se você não solicitou a redefinição de senha, pode ignorar este e-mail com segurança. Ninguém mais terá acesso à sua conta.</p>
            <p>Atenciosamente,<br>Equipe EducaKids</p>
            <hr style="border: none; border-top: 1px solid #eee; margin-top: 20px;" />
            <p style="font-size: 12px; color: #999; text-align: center;">Se estiver com problemas para clicar no botão, copie e cole o seguinte URL no seu navegador:<br><a href="${link}" style="color: #24A9F4;">${link}</a></p>
          </div>
        </div>
      `,
    };

    // Envia o e-mail
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ ok: true, message: 'E-mail de redefinição enviado com sucesso.' }, { status: 200 });

  } catch (e: any) {
    console.error('Erro na API send-reset:', e);
    
    // Personaliza a mensagem de erro para o cliente
    let errorMessage = 'Ocorreu um erro inesperado ao enviar o e-mail.';
    if (e.code === 'auth/user-not-found') {
      // Por segurança, não informamos que o e-mail não existe.
      // A função retorna sucesso para não permitir que alguém descubra quais e-mails estão cadastrados.
      console.log(`E-mail de reset solicitado para usuário não existente: ${e.email}`);
      return NextResponse.json({ ok: true, message: 'Se o e-mail estiver cadastrado, um link será enviado.' }, { status: 200 });
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

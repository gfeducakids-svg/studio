
import 'server-only';
import * as admin from 'firebase-admin';
import nodemailer from 'nodemailer';

/**
 * Verifica se todas as chaves de ambiente necessárias estão presentes.
 * @param keys - Um array de nomes de variáveis de ambiente a serem verificadas.
 * @returns Um objeto com o status da verificação e uma lista de chaves ausentes.
 */
export function assertEnv(keys: string[]): {ok: boolean; missing: string[]} {
  const missing = keys.filter((key) => !process.env[key]);
  return {ok: missing.length === 0, missing};
}

/**
 * Analisa a string JSON da Service Account do Firebase a partir das variáveis de ambiente.
 * Lança um erro claro se o JSON for inválido.
 * @returns O objeto da Service Account parseado.
 */
export function parseServiceAccount(): Record<string, any> {
  const saJson = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!saJson) {
    throw new Error('A variável de ambiente FIREBASE_SERVICE_ACCOUNT não está definida.');
  }
  try {
    return JSON.parse(saJson);
  } catch (e) {
    throw new Error('Falha ao fazer o parse do JSON da FIREBASE_SERVICE_ACCOUNT. Verifique se o valor está correto.');
  }
}

/**
 * Cria uma instância do transporter do Nodemailer para o Gmail usando as variáveis de ambiente.
 * @returns Uma instância do transporter do Nodemailer.
 */
export function makeTransportGmail() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASS, // Deve ser uma Senha de App
    },
  });
}

/**
 * Inicializa o Firebase Admin SDK se ainda não tiver sido inicializado.
 * Esta função é segura para ser chamada múltiplas vezes (padrão singleton).
 */
export function initAdmin() {
  if (admin.apps.length === 0) {
    try {
      const serviceAccount = parseServiceAccount();
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      console.log('Firebase Admin SDK inicializado com sucesso.');
    } catch (e: any) {
      // Loga o erro de inicialização para depuração no servidor
      console.error('FALHA NA INICIALIZAÇÃO DO FIREBASE ADMIN SDK:', e.message);
      // Lança o erro para que a API que o chamou possa tratá-lo
      throw e;
    }
  }
}

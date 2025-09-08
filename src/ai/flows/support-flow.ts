'use server';
/**
 * @fileOverview Um agente de IA para suporte ao cliente do produto "Método Chinês de Grafismo Fonético".
 *
 * - chatWithSupport - Uma função que lida com as interações de chat de suporte.
 * - ChatWithSupportInput - O tipo de entrada para a função chatWithSupport.
 * - ChatWithSupportOutput - O tipo de retorno para a função chatWithSupport.
 */

import 'server-only';
import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ChatWithSupportInputSchema = z.object({
  userQuestion: z.string().describe('A pergunta do usuário.'),
});
export type ChatWithSupportInput = z.infer<typeof ChatWithSupportInputSchema>;

const ChatWithSupportOutputSchema = z.object({
  answer: z.string().describe('A resposta da IA para a pergunta do usuário.'),
});
export type ChatWithSupportOutput = z.infer<typeof ChatWithSupportOutputSchema>;

export async function chatWithSupport(input: ChatWithSupportInput): Promise<ChatWithSupportOutput> {
  return supportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'supportPrompt',
  input: {schema: ChatWithSupportInputSchema},
  output: {schema: ChatWithSupportOutputSchema},
  prompt: `Você é um assistente de suporte virtual para a plataforma educacional "Método Chinês de Grafismo Fonético". Sua personalidade é amigável, paciente, lúdica e pedagógica. Seu objetivo é ajudar pais e crianças a entenderem o método e a plataforma, sempre em português (pt-BR).

  **Sobre o Produto "Método Chinês de Grafismo Fonético":**
  É um método de alfabetização infantil inovador, que ensina a ler e escrever através de traços e sons, de forma divertida e eficaz.
  Os módulos são:
  1.  **Introdução:** Boas-vindas e visão geral.
  2.  **Pré-Alfabetização:** Habilidades motoras e consciência fonológica.
  3.  **Apresentando o Alfabeto:** Associação de formas e sons das letras.
  4.  **Sílabas Simples:** Combinação de consoantes e vogais.
  5.  **Método Fônico:** Pronúncia correta e regras.
  6.  **Formação de Palavras e Frases:** Construção de vocabulário.
  7.  **Escrita e Compreensão Leitora:** Leitura de textos e escrita.
  8.  **Bônus:** Liberado 7 dias após a compra.

  **Sua Tarefa:**
  Responda à pergunta do usuário de forma clara e simples. Use uma linguagem que uma criança possa entender, mas que também seja útil para os pais. Incentive-os e parabenize-os por seu progresso.

  Pergunta do Usuário: {{{userQuestion}}}
  `,
});

const supportFlow = ai.defineFlow(
  {
    name: 'supportFlow',
    inputSchema: ChatWithSupportInputSchema,
    outputSchema: ChatWithSupportOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

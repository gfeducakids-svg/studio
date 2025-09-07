
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { unlockModuleForUserByEmail } from '@/services/user-service';

// Mapeia o ID do produto da Kiwify para o ID do módulo no nosso sistema.
// Você precisará preencher isso com os IDs reais dos seus produtos na Kiwify.
const KIWIFY_PRODUCT_TO_MODULE_ID: { [key: string]: string } = {
  'prod_12345': 'grafismo-fonetico',
  'prod_67890': 'desafio-21-dias',
  'prod_abcde': 'historias-curtas',
  'prod_fghij': 'checklist-alfabetizacao',
  // Adicione outros produtos aqui...
};

async function verifySignature(request: NextRequest, secret: string) {
    const signature = request.headers.get('X-Signature');
    if (!signature) {
        throw new Error('Signature not found.');
    }

    const body = await request.text();
    const hmac = crypto.createHmac('sha256', secret);
    const digest = hmac.update(body).digest('hex');

    if (digest !== signature) {
        throw new Error('Invalid signature.');
    }

    // Retorna o body já lido para que não precise ser lido novamente
    return JSON.parse(body);
}

export async function POST(request: NextRequest) {
    const secret = process.env.KIWIFY_WEBHOOK_SECRET;

    if (!secret) {
        console.error('KIWIFY_WEBHOOK_SECRET is not set in environment variables.');
        return NextResponse.json({ success: false, message: 'Server configuration error.' }, { status: 500 });
    }

    try {
        const payload = await verifySignature(request, secret);

        if (payload.event === 'order.status_changed' && payload.data.status === 'paid') {
            const order = payload.data;
            const customerEmail = order.customer.email;
            const productId = order.product.id.toString(); 

            const moduleId = KIWIFY_PRODUCT_TO_MODULE_ID[productId];

            if (!moduleId) {
                console.warn(`Webhook received for an unmapped product ID: ${productId}`);
                return NextResponse.json({ success: true, message: 'Product not mapped, but webhook acknowledged.' });
            }

            console.log(`Unlocking module '${moduleId}' for user '${customerEmail}'...`);
            await unlockModuleForUserByEmail(customerEmail, moduleId);
            
            return NextResponse.json({ success: true, message: `Module ${moduleId} unlocked for ${customerEmail}.` });
        }

        return NextResponse.json({ success: true, message: 'Webhook received, but no action taken.' });

    } catch (error: any) {
        if (error.message.includes('signature')) {
            return NextResponse.json({ success: false, message: error.message }, { status: 401 });
        }
        console.error('Error processing Kiwify webhook:', error);
        return NextResponse.json({ success: false, message: 'An error occurred.' }, { status: 500 });
    }
}

import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2025-12-15.clover' as any, // Cast to any to avoid type issues if types are outdated
});

export async function POST(request: Request) {
    try {
        // If keys are missing, return a simulation or specific error
        if (!process.env.STRIPE_SECRET_KEY) {
            return NextResponse.json(
                {
                    error: "Stripe not configured",
                    message: "SANDBOX_MODE: Add STRIPE_SECRET_KEY to .env to enable real payments."
                },
                { status: 503 }
            );
        }

        const body = await request.json();
        const { missionId, title, amount, providerId } = body;

        // Create Checkout Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'brl',
                        product_data: {
                            name: `Missão: ${title}`,
                            description: `Pagamento para o prestador (ID: ${providerId})`,
                        },
                        unit_amount: Math.round(amount * 100), // Stripe expects cents
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${request.headers.get('origin')}/mission/${missionId}?payment=success`,
            cancel_url: `${request.headers.get('origin')}/mission/${missionId}?payment=cancelled`,
            metadata: {
                missionId,
                providerId,
                type: 'mission_payment'
            }
        });

        return NextResponse.json({ url: session.url });
    } catch (err: any) {
        console.error('Stripe Error:', err);
        return NextResponse.json(
            { error: 'Internal Server Error', message: err.message },
            { status: 500 }
        );
    }
}

import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = process.env.STRIPE_SECRET_KEY
    ? new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: '2025-12-15.clover' as any,
    })
    : null;

export async function POST(request: Request) {
    try {
        if (!stripe) {
            return NextResponse.json(
                {
                    error: "Stripe not configured",
                    message: "SANDBOX_MODE: Stripe Identity requires API Keys."
                },
                { status: 503 }
            );
        }

        const body = await request.json();
        const { userId, email } = body;

        // Create Verification Session
        const verificationSession = await stripe.identity.verificationSessions.create({
            type: 'document',
            metadata: {
                userId,
            },
            options: {
                document: {
                    allowed_types: ['driving_license', 'passport', 'id_card'],
                    require_live_capture: true,
                    require_matching_selfie: true,
                },
            },
            return_url: `${request.headers.get('origin')}/register?verified=true`,
        });

        return NextResponse.json({
            url: verificationSession.url,
            id: verificationSession.id
        });

    } catch (err: any) {
        console.error('Identity Error:', err);
        return NextResponse.json(
            { error: 'Internal Server Error', message: err.message },
            { status: 500 }
        );
    }
}

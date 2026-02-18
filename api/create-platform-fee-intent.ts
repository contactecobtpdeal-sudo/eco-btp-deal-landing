import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!.trim(), {
  maxNetworkRetries: 3,
  timeout: 20000,
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const pi = await stripe.paymentIntents.create({
      amount: 199,
      currency: 'eur',
      automatic_payment_methods: { enabled: true },
    });

    return res.status(200).json({ clientSecret: pi.client_secret });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    console.error('Platform fee intent error:', message);
    return res.status(500).json({ error: message });
  }
}

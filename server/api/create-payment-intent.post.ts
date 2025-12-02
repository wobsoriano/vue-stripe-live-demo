import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-11-17.clover',
});

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { amount, currency = 'usd' } = body;

    // Validate amount
    if (!amount || amount < 1) {
      throw createError({
        statusCode: 400,
        message: 'Invalid amount. Minimum amount is 1.',
      });
    }

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return {
      clientSecret: paymentIntent.client_secret,
    };
  } catch (error: any) {
    console.error('Error creating payment intent:', error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to create payment intent',
    });
  }
});


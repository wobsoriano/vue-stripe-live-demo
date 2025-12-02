<script setup lang="ts">
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from 'vue-stripe';

const config = useRuntimeConfig();
const stripePromise = loadStripe(config.public.stripePublishableKey);
const amount = 50.00; // Fixed amount - can be made configurable via props or env

// Create initial payment intent
const { data: paymentIntent } = await useFetch('/api/create-payment-intent', {
  method: 'POST',
  body: {
    amount: amount,
    currency: 'usd',
  },
});
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
    <Elements
      v-if="paymentIntent?.clientSecret"
      :stripe="stripePromise"
      :options="{
        clientSecret: paymentIntent.clientSecret,
        appearance: {
          theme: 'stripe',
        },
      }"
    >
      <PaymentForm />
    </Elements>
  </div>
</template>

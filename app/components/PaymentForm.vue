<script setup lang="ts">
import { ref, reactive } from 'vue';
import { PaymentElement, useStripe, useElements } from 'vue-stripe';

const form = reactive({
  name: 'Sarah Johnson',
  email: 'sarah.johnson@example.com',
  address: '123 Main Street, Apt 4B',
  city: 'New York',
  zipCode: '10001',
  country: 'US',
});

const isLoading = ref(false);
const error = ref('');
const success = ref('');

const stripe = useStripe();
const elements = useElements();

const handleSubmit = async () => {
  if (!stripe.value || !elements.value) {
    return;
  }

  isLoading.value = true;
  error.value = '';
  success.value = '';

  try {
    const { error: submitError } = await elements.value.submit();
    if (submitError) {
      error.value = submitError.message || 'Please check your payment details';
      isLoading.value = false;
      return;
    }
    
    const { error: confirmError } = await stripe.value.confirmPayment({
      elements: elements.value,
      confirmParams: {
        payment_method_data: {
          billing_details: {
            name: form.name,
            email: form.email,
            address: {
              line1: form.address,
              city: form.city,
              postal_code: form.zipCode,
              country: form.country,
            },
          },
        },
      },
      redirect: 'if_required',
    });

    if (confirmError) {
      error.value = confirmError.message || 'Payment failed';
    } else {
      success.value = 'Payment successful!';
    }
  } catch (err) {
    error.value = 'An unexpected error occurred';
    console.error(err);
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="w-full max-w-2xl mx-auto p-6">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 relative">
      <div class="flex items-start justify-between mb-2">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
          Payment Element Example
        </h1>
        <a
          href="https://github.com/your-username/nuxt-stripe-demo"
          target="_blank"
          rel="noopener noreferrer"
          class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          aria-label="View on GitHub"
        >
          <svg
            class="w-6 h-6"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              fill-rule="evenodd"
              d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
              clip-rule="evenodd"
            />
          </svg>
        </a>
      </div>
      <p class="text-gray-600 dark:text-gray-400 mb-6">
        Complete your payment securely with Stripe
      </p>

      <form class="space-y-6" @submit.prevent="handleSubmit">
        <!-- Customer Information Section -->
        <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Customer Information
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Name -->
            <div class="md:col-span-2">
              <label
                for="name"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Name <span class="text-red-500">*</span>
              </label>
              <input
                id="name"
                v-model="form.name"
                type="text"
                required
                class="block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="John Doe"
              >
            </div>

            <!-- Email -->
            <div class="md:col-span-2">
              <label
                for="email"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Email <span class="text-red-500">*</span>
              </label>
              <input
                id="email"
                v-model="form.email"
                type="email"
                required
                class="block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="john@example.com"
              >
            </div>

            <!-- Address -->
            <div class="md:col-span-2">
              <label
                for="address"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Address <span class="text-red-500">*</span>
              </label>
              <input
                id="address"
                v-model="form.address"
                type="text"
                required
                class="block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="123 Main St"
              >
            </div>

            <!-- City -->
            <div>
              <label
                for="city"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                City <span class="text-red-500">*</span>
              </label>
              <input
                id="city"
                v-model="form.city"
                type="text"
                required
                class="block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="New York"
              >
            </div>

            <!-- ZIP Code -->
            <div>
              <label
                for="zipCode"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                ZIP Code <span class="text-red-500">*</span>
              </label>
              <input
                id="zipCode"
                v-model="form.zipCode"
                type="text"
                required
                class="block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="10001"
              >
            </div>

            <!-- Country -->
            <div class="md:col-span-2">
              <label
                for="country"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Country <span class="text-red-500">*</span>
              </label>
              <select
                id="country"
                v-model="form.country"
                required
                class="block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="US">United States</option>
                <option value="CA">Canada</option>
                <option value="GB">United Kingdom</option>
                <option value="AU">Australia</option>
                <option value="DE">Germany</option>
                <option value="FR">France</option>
                <option value="ES">Spain</option>
                <option value="IT">Italy</option>
                <option value="NL">Netherlands</option>
                <option value="BE">Belgium</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Payment Element -->
        <div class="border border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
          <PaymentElement
            :options="{
              layout: 'tabs',
            }"
          />
        </div>

        <!-- Error Message -->
        <div v-if="error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p class="text-sm text-red-800 dark:text-red-200">{{ error }}</p>
        </div>

        <!-- Success Message -->
        <div v-if="success" class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <p class="text-sm text-green-800 dark:text-green-200">
            {{ success }}
          </p>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          :disabled="!stripe || !elements || isLoading"
          :class="[
            'w-full py-3 px-4 rounded-lg font-semibold text-white transition-colors',
            !stripe || !elements || isLoading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
          ]"
        >
          {{ isLoading ? 'Processing...' : 'Complete Payment' }}
        </button>
      </form>
    </div>
  </div>
</template>


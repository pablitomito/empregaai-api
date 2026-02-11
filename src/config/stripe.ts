import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY não está definida nas variáveis de ambiente');
}

// Inicializar Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16', // Usar versão mais recente
  typescript: true,
});

// Configurações de produto/preço
export const STRIPE_CONFIG = {
  PRICE_ID: process.env.STRIPE_PRICE_ID || '',
  PRODUCT_ID: process.env.STRIPE_PRODUCT_ID || '',
  CURRENCY: 'EUR',
  AMOUNT: 399, // €3,99 em centavos
  INTERVAL: 'month' as const,
  SUCCESS_URL: `${process.env.FRONTEND_URL}/dashboard?payment=success`,
  CANCEL_URL: `${process.env.FRONTEND_URL}/pricing?payment=cancelled`,
};

// Helper: Criar checkout session
export const createCheckoutSession = async (
  customerId: string | null,
  customerEmail: string,
  userId: string
) => {
  const session = await stripe.checkout.sessions.create({
    customer: customerId || undefined,
    customer_email: customerId ? undefined : customerEmail,
    line_items: [
      {
        price: STRIPE_CONFIG.PRICE_ID,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: STRIPE_CONFIG.SUCCESS_URL,
    cancel_url: STRIPE_CONFIG.CANCEL_URL,
    metadata: {
      userId,
    },
    subscription_data: {
      metadata: {
        userId,
      },
    },
    allow_promotion_codes: true, // Permitir códigos promocionais
  });
  
  return session;
};

// Helper: Criar portal de gerenciamento de assinatura
export const createBillingPortalSession = async (
  customerId: string,
  returnUrl?: string
) => {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl || `${process.env.FRONTEND_URL}/dashboard`,
  });
  
  return session;
};

// Helper: Cancelar assinatura
export const cancelSubscription = async (subscriptionId: string) => {
  const subscription = await stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: true,
  });
  
  return subscription;
};

// Helper: Reativar assinatura cancelada
export const reactivateSubscription = async (subscriptionId: string) => {
  const subscription = await stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: false,
  });
  
  return subscription;
};

// Helper: Obter informações da assinatura
export const getSubscription = async (subscriptionId: string) => {
  return await stripe.subscriptions.retrieve(subscriptionId);
};

// Helper: Criar customer no Stripe
export const createCustomer = async (email: string, name: string, userId: string) => {
  return await stripe.customers.create({
    email,
    name,
    metadata: {
      userId,
    },
  });
};

export default stripe;

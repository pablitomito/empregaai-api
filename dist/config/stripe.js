"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCustomer = exports.getSubscription = exports.reactivateSubscription = exports.cancelSubscription = exports.createBillingPortalSession = exports.createCheckoutSession = exports.STRIPE_CONFIG = void 0;
const stripe_1 = __importDefault(require("stripe"));
if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY não está definida nas variáveis de ambiente');
}
// Inicializar Stripe
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2023-10-16', // Usar versão mais recente
    typescript: true,
});
// Configurações de produto/preço
exports.STRIPE_CONFIG = {
    PRICE_ID: process.env.STRIPE_PRICE_ID || '',
    PRODUCT_ID: process.env.STRIPE_PRODUCT_ID || '',
    CURRENCY: 'EUR',
    AMOUNT: 399, // €3,99 em centavos
    INTERVAL: 'month',
    SUCCESS_URL: `${process.env.FRONTEND_URL}/dashboard?payment=success`,
    CANCEL_URL: `${process.env.FRONTEND_URL}/pricing?payment=cancelled`,
};
// Helper: Criar checkout session
const createCheckoutSession = async (customerId, customerEmail, userId) => {
    const session = await stripe.checkout.sessions.create({
        customer: customerId || undefined,
        customer_email: customerId ? undefined : customerEmail,
        line_items: [
            {
                price: exports.STRIPE_CONFIG.PRICE_ID,
                quantity: 1,
            },
        ],
        mode: 'subscription',
        success_url: exports.STRIPE_CONFIG.SUCCESS_URL,
        cancel_url: exports.STRIPE_CONFIG.CANCEL_URL,
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
exports.createCheckoutSession = createCheckoutSession;
// Helper: Criar portal de gerenciamento de assinatura
const createBillingPortalSession = async (customerId, returnUrl) => {
    const session = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: returnUrl || `${process.env.FRONTEND_URL}/dashboard`,
    });
    return session;
};
exports.createBillingPortalSession = createBillingPortalSession;
// Helper: Cancelar assinatura
const cancelSubscription = async (subscriptionId) => {
    const subscription = await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: true,
    });
    return subscription;
};
exports.cancelSubscription = cancelSubscription;
// Helper: Reativar assinatura cancelada
const reactivateSubscription = async (subscriptionId) => {
    const subscription = await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: false,
    });
    return subscription;
};
exports.reactivateSubscription = reactivateSubscription;
// Helper: Obter informações da assinatura
const getSubscription = async (subscriptionId) => {
    return await stripe.subscriptions.retrieve(subscriptionId);
};
exports.getSubscription = getSubscription;
// Helper: Criar customer no Stripe
const createCustomer = async (email, name, userId) => {
    return await stripe.customers.create({
        email,
        name,
        metadata: {
            userId,
        },
    });
};
exports.createCustomer = createCustomer;
exports.default = stripe;
//# sourceMappingURL=stripe.js.map
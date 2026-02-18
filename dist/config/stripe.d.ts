import Stripe from 'stripe';
declare const stripe: Stripe;
export declare const STRIPE_CONFIG: {
    PRICE_ID: string;
    PRODUCT_ID: string;
    CURRENCY: string;
    AMOUNT: number;
    INTERVAL: "month";
    SUCCESS_URL: string;
    CANCEL_URL: string;
};
export declare const createCheckoutSession: (customerId: string | null, customerEmail: string, userId: string) => Promise<Stripe.Response<Stripe.Checkout.Session>>;
export declare const createBillingPortalSession: (customerId: string, returnUrl?: string) => Promise<Stripe.Response<Stripe.BillingPortal.Session>>;
export declare const cancelSubscription: (subscriptionId: string) => Promise<Stripe.Response<Stripe.Subscription>>;
export declare const reactivateSubscription: (subscriptionId: string) => Promise<Stripe.Response<Stripe.Subscription>>;
export declare const getSubscription: (subscriptionId: string) => Promise<Stripe.Response<Stripe.Subscription>>;
export declare const createCustomer: (email: string, name: string, userId: string) => Promise<Stripe.Response<Stripe.Customer>>;
export default stripe;
//# sourceMappingURL=stripe.d.ts.map
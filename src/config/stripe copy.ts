import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY não definida");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
  typescript: true,
});

export const STRIPE_PRICES = {
  DISTRIBUIR: process.env.STRIPE_PRICE_DISTRIBUIR!, // €2,99
  PDF: process.env.STRIPE_PRICE_PDF!, // €1,99
};

export const FRONTEND_URL = process.env.FRONTEND_URL!;

// -----------------------------
// Criar sessão de checkout
// -----------------------------
export const createCheckoutSession = async ({
  userId,
  email,
  type,
}: {
  userId: string;
  email: string;
  type: "distribuir" | "pdf";
}) => {
  const priceId =
    type === "distribuir"
      ? STRIPE_PRICES.DISTRIBUIR
      : STRIPE_PRICES.PDF;

  if (!priceId) throw new Error("PRICE_ID não configurado");

  const session = await stripe.checkout.sessions.create({
    mode: type === "distribuir" ? "subscription" : "payment",
    customer_email: email,

    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],

    success_url: `${FRONTEND_URL}/checkout/success?type=${type}`,
    cancel_url: `${FRONTEND_URL}/checkout/cancel`,

    metadata: {
      userId,
      type,
    },
  });

  return session;
};

// -----------------------------
// Portal de faturação
// -----------------------------
export const createBillingPortalSession = async (
  customerId: string
) => {
  return stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${FRONTEND_URL}/dashboard`,
  });
};

export default stripe;
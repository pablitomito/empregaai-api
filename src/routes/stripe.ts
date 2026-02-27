import { Router } from "express";
import { createCheckoutSession } from "../config/stripe";

const router = Router();

router.post("/checkout", async (req, res) => {
  try {
    const { type, email, userId } = req.body;

    if (!email || !userId) {
      return res.status(400).json({ error: "Email ou userId não fornecido" });
    }

    let priceId: string;
    let isSubscription = false;

    if (type === "distribuir") {
      priceId = process.env.STRIPE_PRICE_DISTRIBUIR!;
      isSubscription = true; // recorrente
    } else if (type === "pdf") {
      priceId = process.env.STRIPE_PRICE_PDF!;
      isSubscription = false; // one-time
    } else {
      return res.status(400).json({ error: "Tipo inválido" });
    }

    const session = await createCheckoutSession({ userId, email, type });
    return res.json({ url: session.url });
  } catch (err: any) {
    console.error("Erro Stripe Checkout:", err);
    return res.status(500).json({
      error: "Erro ao criar checkout",
      details: err.message || err,
    });
  }
});

export default router;
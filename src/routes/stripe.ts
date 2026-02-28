import { Router } from "express";
import { createCheckoutSession } from "../config/stripe";

const router = Router();

router.post("/checkout", async (req, res) => {
  try {
    const { type, email, userId } = req.body;

    if (!email || !userId) {
      return res.status(400).json({ error: "Email ou userId não fornecido" });
    }

    if (type !== "distribuir" && type !== "pdf") {
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

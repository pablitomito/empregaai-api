import express, { Request, Response } from "express";
import stripe from "../config/stripe";
import User from "../models/User";
import { generateCVPDF } from "../services/cv-generator/generator";
import { uploadCVToR2 } from "../services/storage/r2-client";
import { sendCVEmail } from "../services/email/sender";

const router = express.Router();

// Stripe exige RAW BODY para validar assinatura
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req: Request, res: Response) => {
    const sig = req.headers["stripe-signature"];

    if (!sig) {
      console.error("❌ Stripe signature missing");
      return res.status(400).send("Missing Stripe signature");
    }

    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (err: any) {
      console.error("❌ Erro ao validar webhook:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // -----------------------------
    // EVENTO PRINCIPAL: PAGAMENTO CONFIRMADO
    // -----------------------------
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as any;

      const userId = session.metadata?.userId;
      
      console.log("💳 Pagamento confirmado para user:", userId);

      if (!userId) {
        console.error("❌ userId não encontrado no metadata");
        return res.status(400).send("Missing userId");
      }

      // Buscar utilizador
      const user = await User.findById(userId);
      if (!user) {
        console.error("❌ Utilizador não encontrado:", userId);
        return res.status(404).send("User not found");
      }

      // Buscar dados do CV (devemos guardar antes do pagamento)
      const userData = user.pendingCVData;
      if (!userData) {
        console.error("❌ Nenhum userData encontrado para gerar CV");
        return res.status(400).send("Missing CV data");
      }

      try {
        console.log("🎨 Gerando CV após pagamento...");
        const pdfBuffer = await generateCVPDF(userData);

        console.log("☁️ Fazendo upload para R2...");
        const pdfUrl = await uploadCVToR2(pdfBuffer, userId);

        console.log("📧 Enviando email com CV...");
        await sendCVEmail(user.email, user.fullName, pdfUrl, pdfBuffer);

        // Atualizar estatísticas
        user.stats.cvGenerated += 1;
        user.subscription.status = "premium";
        user.pendingCVData = undefined; // limpar
        await user.save();

        console.log("✅ Fluxo completo finalizado com sucesso!");
      } catch (err) {
        console.error("❌ Erro no fluxo pós-pagamento:", err);
      }
    }

    res.json({ received: true });
  }
);

export default router;

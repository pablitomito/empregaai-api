import { Request, Response } from "express";
import User from "../models/User";

export const saveCVData = async (req: Request, res: Response) => {
  try {
    const { userId, userData } = req.body;

    if (!userId || !userData) {
      return res.status(400).json({
        success: false,
        message: "userId e userData são obrigatórios"
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Usuário não encontrado"
      });
    }

    // 🔥 SALVA OS DADOS DO CV ANTES DO PAGAMENTO
    user.pendingCVData = userData;
    await user.save();

    return res.json({
      success: true,
      message: "Dados do CV salvos com sucesso"
    });

  } catch (err: any) {
    console.error("❌ Erro ao salvar dados do CV:", err);
    return res.status(500).json({
      success: false,
      message: "Erro interno ao salvar dados do CV",
      error: err.message
    });
  }
};

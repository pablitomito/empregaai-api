import { Router } from "express";
import { generateCV, listTemplates } from "../controllers/cvController";
import { saveCVData } from "../controllers/cvDataController";

const router = Router();

/**
 * 1) Salvar dados do CV antes do pagamento
 * O frontend envia userId + userData
 * O backend guarda no User.pendingCVData
 */
router.post("/save-data", saveCVData);

/**
 * 2) Gerar CV manualmente (opcional)
 * Útil para testes sem Stripe
 */
router.post("/generate", generateCV);

/**
 * 3) Listar templates disponíveis
 */
router.get("/templates", listTemplates);

export default router;

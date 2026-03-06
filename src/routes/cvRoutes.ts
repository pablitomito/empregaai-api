import { Router } from 'express';
import { protect, premiumOnly, requireCompleteProfile } from '../middleware/auth';
import {
  generateCV,
  getMyCVs,
  getLatestCV,
  getCVById,
  downloadCVPDF,
  deleteCV,
} from '../controllers/cvController';

const router = Router();

// Todas as rotas requerem autenticação
router.use(protect);

// POST /api/cv/generate
// Gerar CV com IA — requer perfil completo
router.post('/generate', requireCompleteProfile, generateCV);

// GET /api/cv
// Listar todos os CVs do utilizador
router.get('/', getMyCVs);

// GET /api/cv/latest
// CV mais recente
router.get('/latest', getLatestCV);

// GET /api/cv/:id
// CV por ID
router.get('/:id', getCVById);

// GET /api/cv/:id/download
// Download PDF — premium only
router.get('/:id/download', premiumOnly, downloadCVPDF);

// DELETE /api/cv/:id
router.delete('/:id', deleteCV);

export default router;
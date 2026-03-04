import { Router } from 'express';
import { protect } from '../middleware/auth';
import {
  generateResume,
  generateCoverLetter,
  generateSummary,
  optimizeResume,
  getMatchScore,
} from '../controllers/aiController';

const router = Router();

// Todas as rotas de IA requerem autenticação
router.use(protect);

// POST /api/ai/generate-resume      → Gera CV completo com IA + devolve PDF
router.post('/generate-resume', generateResume);

// POST /api/ai/cover-letter         → Gera carta de apresentação
// Body: { title, company, description }
router.post('/cover-letter', generateCoverLetter);

// POST /api/ai/professional-summary → Gera resumo profissional e guarda no perfil
router.post('/professional-summary', generateSummary);

// POST /api/ai/optimize-ats         → Otimiza texto de CV para ATS
// Body: { resumeText }
router.post('/optimize-ats', optimizeResume);

// POST /api/ai/match-score          → Score de compatibilidade perfil/vaga (grátis)
// Body: { jobDescription }
router.post('/match-score', getMatchScore);

export default router;
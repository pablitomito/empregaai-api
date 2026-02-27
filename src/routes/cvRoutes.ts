import { Router } from 'express';
import { 
  generateCV, 
  listTemplates, 
  generateCVWithTemplate  // 🆕
} from '../controllers/cvController';

const router = Router();

router.post('/generate', generateCV);
router.post('/generate-with-template', generateCVWithTemplate); // 🆕
router.get('/templates', listTemplates);

export default router;
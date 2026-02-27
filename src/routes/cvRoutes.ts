import { Router } from 'express';
import { generateCV } from '../controllers/cvController';

const router = Router();

router.post('/generate', generateCV);

export default router;
import { Router } from 'express';
import { register, login, googleAuth } from '../controllers/authController';
import { validate, registerSchema, loginSchema } from '../middleware/validation';

const router = Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/google', googleAuth);

export default router;

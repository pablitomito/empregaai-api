import { Router } from "express";
import { register, login, googleAuth, getMe } from "../controllers/authController";
import { validate, registerSchema, loginSchema } from "../middleware/validation";
import { protect } from "../middleware/auth";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/google", googleAuth);
router.get("/me", protect, getMe);

export default router;

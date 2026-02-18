import { Router } from "express";
import { protect } from "../middleware/auth";
import {
  generateResumeAI,
  generateCoverLetterAI
} from "../controllers/aiController";

const router = Router();

router.post("/generate-resume", protect, generateResumeAI);
router.post("/generate-cover-letter", protect, generateCoverLetterAI);

export default router;

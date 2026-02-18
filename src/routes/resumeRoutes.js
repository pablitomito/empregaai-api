import { Router } from "express";
import { protect, premiumOnly } from "../middleware/auth";
import {
  createResume,
  getLatestResume,
  getResumeById,
  downloadResumePDF,
} from "../controllers/resumeController.js";

const router = Router();

router.post("/", protect, createResume);
router.get("/latest", protect, getLatestResume);
router.get("/:id", protect, getResumeById);
router.get("/:id/download", protect, premiumOnly, downloadResumePDF);

export default router;

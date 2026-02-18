"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const aiController_1 = require("../controllers/aiController");
const router = (0, express_1.Router)();
router.post("/generate-resume", auth_1.protect, aiController_1.generateResumeAI);
router.post("/generate-cover-letter", auth_1.protect, aiController_1.generateCoverLetterAI);
exports.default = router;
//# sourceMappingURL=ai.routes.js.map
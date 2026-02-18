"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const validation_1 = require("../middleware/validation");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.post("/register", (0, validation_1.validate)(validation_1.registerSchema), authController_1.register);
router.post("/login", (0, validation_1.validate)(validation_1.loginSchema), authController_1.login);
router.post("/google", authController_1.googleAuth);
router.get("/me", auth_1.protect, authController_1.getMe);
exports.default = router;
//# sourceMappingURL=authRoutes.js.map
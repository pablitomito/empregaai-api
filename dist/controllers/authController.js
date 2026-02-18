"use strict";
/* eslint-disable @typescript-eslint/no-unused-vars */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.googleAuth = exports.getMe = exports.login = exports.register = void 0;
const User_1 = __importDefault(require("../models/User"));
const auth_1 = require("../middleware/auth");
const errorHandler_1 = require("../middleware/errorHandler");
// REGISTER
exports.register = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { email, password, fullName } = req.body;
    const userExists = await User_1.default.findOne({ email });
    if (userExists) {
        return res
            .status(400)
            .json({ success: false, message: "Email já cadastrado" });
    }
    const user = await User_1.default.create({
        email,
        password,
        fullName,
        subscription: { status: "free" },
        isActive: true,
        isEmailVerified: false,
    });
    const token = (0, auth_1.generateToken)(user._id.toString(), user.email);
    res.status(201).json({
        success: true,
        data: {
            user: {
                id: user._id,
                email: user.email,
                fullName: user.fullName,
                subscription: user.subscription.status,
            },
            token,
        },
    });
});
// LOGIN
exports.login = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { email, password } = req.body;
    const user = await User_1.default.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
        return res
            .status(401)
            .json({ success: false, message: "Credenciais inválidas" });
    }
    const token = (0, auth_1.generateToken)(user._id.toString(), user.email);
    res.json({
        success: true,
        data: {
            user: {
                id: user._id,
                email: user.email,
                fullName: user.fullName,
                subscription: user.subscription.status,
            },
            token,
        },
    });
});
// GET ME
exports.getMe = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    if (!req.user) {
        return res
            .status(401)
            .json({ success: false, message: "Não autenticado." });
    }
    res.json({
        success: true,
        data: {
            id: req.user._id,
            email: req.user.email,
            fullName: req.user.fullName,
            subscription: req.user.subscription.status,
            isActive: req.user.isActive,
            isEmailVerified: req.user.isEmailVerified,
        },
    });
});
// GOOGLE AUTH (placeholder)
exports.googleAuth = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    res.json({ success: true, message: "Google Auth - implementar" });
});
//# sourceMappingURL=authController.js.map
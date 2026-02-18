/* eslint-disable @typescript-eslint/no-unused-vars */

import { Request, Response } from "express";
import User from "../models/User";
import { generateToken } from "../middleware/auth";
import { asyncHandler } from "../middleware/errorHandler";

// REGISTER
export const register = asyncHandler(async (req: Request, res: Response) => {
  const { email, password, fullName } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res
      .status(400)
      .json({ success: false, message: "Email já cadastrado" });
  }

  const user = await User.create({
    email,
    password,
    fullName,
    subscription: { status: "free" },
    isActive: true,
    isEmailVerified: false,
  });

  const token = generateToken(user._id.toString(), user.email);

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
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.comparePassword(password))) {
    return res
      .status(401)
      .json({ success: false, message: "Credenciais inválidas" });
  }

  const token = generateToken(user._id.toString(), user.email);

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
export const getMe = asyncHandler(async (req: Request, res: Response) => {
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
export const googleAuth = asyncHandler(async (req: Request, res: Response) => {
  res.json({ success: true, message: "Google Auth - implementar" });
});

import { Request, Response } from 'express';
import User from '../models/User';
import { generateToken } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { email, password, fullName } = req.body;
  
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400).json({ success: false, message: 'Email já cadastrado' });
    return;
  }
  
  const user = await User.create({ email, password, fullName });
  const token = generateToken(user._id.toString(), user.email);
  
  res.status(201).json({
    success: true,
    data: { user: { id: user._id, email: user.email, fullName: user.fullName }, token },
  });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    res.status(401).json({ success: false, message: 'Credenciais inválidas' });
    return;
  }
  
  const token = generateToken(user._id.toString(), user.email);
  
  res.json({
    success: true,
    data: { user: { id: user._id, email: user.email, fullName: user.fullName }, token },
  });
});

export const googleAuth = asyncHandler(async (req: Request, res: Response) => {
  // Implementar OAuth Google
  res.json({ success: true, message: 'Google Auth - implementar' });
});

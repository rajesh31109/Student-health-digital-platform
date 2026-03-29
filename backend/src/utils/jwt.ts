import jwt from 'jsonwebtoken';
import { env } from '../config.js';

export const generateToken = (
  userId: string,
  role: string,
  customClaims?: Record<string, any>
): string => {
  return jwt.sign(
    {
      userId,
      role,
      ...customClaims,
    },
    env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

export const verifyToken = (token: string): { userId: string; role: string; [key: string]: any } | null => {
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as { userId: string; role: string; [key: string]: any };
    return decoded;
  } catch (error) {
    return null;
  }
};

import jwt from 'jsonwebtoken';
import { ENV } from './env.js';

export const jwtConfig = {
  generateToken(payload) {
    return jwt.sign(payload, ENV.JWT_SECRET, {
      expiresIn: ENV.JWT_EXPIRES_IN,
    });
  },

  verifyToken(token) {
    try {
      return jwt.verify(token, ENV.JWT_SECRET);
    } catch (error) {
      return null;
    }
  },
};

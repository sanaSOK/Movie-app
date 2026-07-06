import { authService } from '../services/authService.js';
import { Validator } from '../utils/validator.js';
import { ResponseHelper } from '../utils/response.js';

export const authController = {
  async signup(req, res, next) {
    try {
      const { username, email, password } = req.body;
      
      const validation = Validator.validateSignup({ username, email, password });
      if (!validation.isValid) {
        return ResponseHelper.error(res, 'Validation error', 400, validation.errors);
      }

      const result = await authService.register(username, email, password);
      return ResponseHelper.success(res, result, 'User registered successfully', 201);
    } catch (error) {
      next(error);
    }
  },

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return ResponseHelper.error(res, 'Email and password are required', 400);
      }

      const result = await authService.login(email, password);
      return ResponseHelper.success(res, result, 'Login successful');
    } catch (error) {
      next(error);
    }
  },

  async getProfile(req, res, next) {
    try {
      const result = await authService.getProfile(req.user.id);
      return ResponseHelper.success(res, result, 'Profile retrieved successfully');
    } catch (error) {
      next(error);
    }
  },
};

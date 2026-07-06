import { Router } from 'express';
import { authController } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/profile', protect, authController.getProfile);

export default router;

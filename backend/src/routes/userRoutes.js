import { Router } from 'express';
import { userController } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = Router();

router.put('/profile', protect, upload.single('avatar'), userController.updateProfile);

export default router;

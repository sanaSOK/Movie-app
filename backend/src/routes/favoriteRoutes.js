import { Router } from 'express';
import { favoriteController } from '../controllers/favoriteController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

// Protect all watchlist routes
router.use(protect);

router.route('/')
  .get(favoriteController.getFavorites)
  .post(favoriteController.addFavorite);

router.route('/:id')
  .delete(favoriteController.removeFavorite);

export default router;

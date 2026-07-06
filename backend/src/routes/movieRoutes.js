import { Router } from 'express';
import { movieController } from '../controllers/movieController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = Router();

router.route('/')
  .get(movieController.getMovies)
  .post(protect, authorize('admin'), movieController.createMovie);

router.route('/:id')
  .get(movieController.getMovieById);

router.post('/:id/comment', protect, movieController.addComment);

export default router;

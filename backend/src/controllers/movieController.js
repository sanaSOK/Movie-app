import { movieService } from '../services/movieService.js';
import { ResponseHelper } from '../utils/response.js';

export const movieController = {
  async getMovies(req, res, next) {
    try {
      const { type, country, genre, search, page, limit } = req.query;
      const result = await movieService.getMovies({ type, country, genre, search, page, limit });
      return ResponseHelper.success(res, result, 'Movies fetched successfully');
    } catch (error) {
      next(error);
    }
  },

  async getMovieById(req, res, next) {
    try {
      const { id } = req.params;
      const result = await movieService.getMovieById(id);
      return ResponseHelper.success(res, result, 'Movie details retrieved');
    } catch (error) {
      next(error);
    }
  },

  async createMovie(req, res, next) {
    try {
      // In production, upload middleware will attach req.file if poster/banner is uploaded
      const result = await movieService.createMovie(req.body);
      return ResponseHelper.success(res, result, 'Movie catalog entry created successfully', 201);
    } catch (error) {
      next(error);
    }
  },

  async addComment(req, res, next) {
    try {
      const { id } = req.params;
      const { text } = req.body;
      if (!text) {
        return ResponseHelper.error(res, 'Comment content is required', 400);
      }

      const user = req.user ? req.user.username : 'Guest';
      const avatar = req.user ? req.user.avatar : 'https://api.dicebear.com/7.x/adventurer/svg?seed=guest';

      const result = await movieService.addComment(id, { user, avatar, text });
      return ResponseHelper.success(res, result, 'Comment submitted successfully', 201);
    } catch (error) {
      next(error);
    }
  },
};

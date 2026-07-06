import { favoriteService } from '../services/favoriteService.js';
import { ResponseHelper } from '../utils/response.js';

export const favoriteController = {
  async getFavorites(req, res, next) {
    try {
      const result = await favoriteService.getFavorites(req.user.id);
      return ResponseHelper.success(res, result, 'Favorites fetched successfully');
    } catch (error) {
      next(error);
    }
  },

  async addFavorite(req, res, next) {
    try {
      const { movieId } = req.body;
      if (!movieId) {
        return ResponseHelper.error(res, 'Movie code identifier is required', 400);
      }

      const result = await favoriteService.addFavorite(req.user.id, movieId);
      return ResponseHelper.success(res, result, 'Added to watchlist successfully', 201);
    } catch (error) {
      next(error);
    }
  },

  async removeFavorite(req, res, next) {
    try {
      const { id } = req.params;
      const result = await favoriteService.removeFavorite(req.user.id, id);
      return ResponseHelper.success(res, result, 'Removed from watchlist successfully');
    } catch (error) {
      next(error);
    }
  },
};

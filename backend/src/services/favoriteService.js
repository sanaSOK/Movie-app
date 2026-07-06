import { Favorite } from '../models/Favorite.js';
import { Movie } from '../models/Movie.js';

export const favoriteService = {
  async getFavorites(userId) {
    const favorites = await Favorite.find({ user: userId })
      .populate('movie')
      .sort({ addedAt: -1 });

    return favorites.map((fav) => fav.movie).filter(Boolean);
  },

  async addFavorite(userId, movieStringId) {
    const movie = await Movie.findOne({ id: movieStringId });
    if (!movie) {
      const error = new Error('Movie/Drama not found');
      error.statusCode = 404;
      throw error;
    }

    const existing = await Favorite.findOne({ user: userId, movie: movie._id });
    if (existing) {
      return existing;
    }

    return await Favorite.create({
      user: userId,
      movie: movie._id,
    });
  },

  async removeFavorite(userId, movieStringId) {
    const movie = await Movie.findOne({ id: movieStringId });
    if (!movie) {
      const error = new Error('Movie/Drama not found');
      error.statusCode = 404;
      throw error;
    }

    const result = await Favorite.findOneAndDelete({ user: userId, movie: movie._id });
    if (!result) {
      const error = new Error('Bookmark entry not found');
      error.statusCode = 404;
      throw error;
    }
    return result;
  },
};

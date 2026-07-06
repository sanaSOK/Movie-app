import { Movie } from '../models/Movie.js';

export const movieService = {
  async getMovies(filters = {}) {
    const queryObj = {};

    if (filters.type && filters.type !== 'All') {
      queryObj.type = filters.type;
    }
    if (filters.country && filters.country !== 'All') {
      queryObj.country = filters.country;
    }
    if (filters.search) {
      queryObj.$or = [
        { title: { $regex: filters.search, $options: 'i' } },
        { synopsis: { $regex: filters.search, $options: 'i' } },
        { genres: { $in: [new RegExp(filters.search, 'i')] } },
      ];
    }

    const limit = parseInt(filters.limit) || 12;
    const page = parseInt(filters.page) || 1;
    const skip = (page - 1) * limit;

    const count = await Movie.countDocuments(queryObj);
    const movies = await Movie.find(queryObj)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    return {
      movies,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalMovies: count,
    };
  },

  async getMovieById(id) {
    const movie = await Movie.findOne({ id });
    if (!movie) {
      const error = new Error('Movie/Drama not found');
      error.statusCode = 404;
      throw error;
    }
    return movie;
  },

  async createMovie(movieData) {
    const existing = await Movie.findOne({ id: movieData.id });
    if (existing) {
      const error = new Error('Movie code identifier already exists');
      error.statusCode = 400;
      throw error;
    }
    return await Movie.create(movieData);
  },

  async addComment(movieId, commentData) {
    const movie = await Movie.findOne({ id: movieId });
    if (!movie) {
      const error = new Error('Movie not found');
      error.statusCode = 404;
      throw error;
    }

    const newComment = {
      id: `c-${Date.now()}`,
      user: commentData.user,
      avatar: commentData.avatar || 'https://api.dicebear.com/7.x/adventurer/svg?seed=user',
      text: commentData.text,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    };

    movie.comments.unshift(newComment);
    await movie.save();
    return newComment;
  },
};

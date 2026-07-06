import mongoose from 'mongoose';

const favoriteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  movie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
    required: true,
  },
  addedAt: {
    type: Date,
    default: Date.now,
  },
});

// Compound index to guarantee uniqueness of favorites per user
favoriteSchema.index({ user: 1, movie: 1 }, { unique: true });

export const Favorite = mongoose.model('Favorite', favoriteSchema);

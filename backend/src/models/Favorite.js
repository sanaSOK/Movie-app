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

favoriteSchema.post('save', async function(doc) {
  try {
    const data = doc.toObject();
    data._id = doc._id.toString();
    data.user = doc.user.toString();
    data.movie = doc.movie.toString();
    await FavoriteMock.createWithId(data);
  } catch (err) {
    console.error('Failed to sync saved Favorite to mock-db:', err);
  }
});

favoriteSchema.post('findOneAndDelete', async function(doc) {
  if (doc) {
    try {
      await FavoriteMock.findOneAndDelete({
        user: doc.user.toString(),
        movie: doc.movie.toString(),
      });
    } catch (err) {
      console.error('Failed to sync deleted Favorite to mock-db:', err);
    }
  }
});

import { FavoriteMock } from '../config/mockDb.js';

const MongooseFavorite = mongoose.model('Favorite', favoriteSchema);

export const Favorite = new Proxy(MongooseFavorite, {
  get(target, prop, receiver) {
    if (mongoose.connection.readyState !== 1) {
      if (prop in FavoriteMock) {
        return FavoriteMock[prop];
      }
    }
    return Reflect.get(target, prop, receiver);
  }
});

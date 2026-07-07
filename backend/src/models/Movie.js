import mongoose from 'mongoose';

const episodeSourceSchema = new mongoose.Schema({
  label: { type: String, required: true },
  url: { type: String, required: true },
});

const episodeSchema = new mongoose.Schema({
  id: { type: String, required: true },
  number: { type: Number, required: true },
  title: { type: String },
  duration: { type: String },
  sources: [episodeSourceSchema],
});

const commentSchema = new mongoose.Schema({
  id: { type: String, required: true },
  user: { type: String, required: true },
  avatar: { type: String },
  text: { type: String, required: true },
  date: { type: String, default: 'Just now' },
});

const movieSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
  },
  type: {
    type: String,
    enum: ['Drama', 'Movie', 'Anime'],
    required: true,
  },
  poster: { type: String },
  banner: { type: String },
  rating: { type: Number, default: 0 },
  quality: { type: String, default: 'HD' },
  year: { type: Number },
  status: { type: String, default: 'Ongoing' },
  country: { type: String },
  synopsis: { type: String },
  genres: [{ type: String }],
  episodes: [episodeSchema],
  comments: [commentSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

movieSchema.post('save', async function(doc) {
  try {
    const data = doc.toObject();
    data._id = doc._id.toString();
    await MovieMock.createWithId(data);
  } catch (err) {
    console.error('Failed to sync saved Movie to mock-db:', err);
  }
});

import { MovieMock } from '../config/mockDb.js';

const MongooseMovie = mongoose.model('Movie', movieSchema);

export const Movie = new Proxy(MongooseMovie, {
  get(target, prop, receiver) {
    if (mongoose.connection.readyState !== 1) {
      if (prop in MovieMock) {
        return MovieMock[prop];
      }
    }
    return Reflect.get(target, prop, receiver);
  }
});

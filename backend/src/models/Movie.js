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

export const Movie = mongoose.model('Movie', movieSchema);

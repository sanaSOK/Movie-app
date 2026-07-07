import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';

// Router imports
import authRoutes from './routes/authRoutes.js';
import movieRoutes from './routes/movieRoutes.js';
import favoriteRoutes from './routes/favoriteRoutes.js';
import userRoutes from './routes/userRoutes.js';

// Error Handler Middleware
import { errorMiddleware } from './middleware/errorMiddleware.js';

const app = express();

// Set up paths for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// General Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static upload resources
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Inject database mode header
app.use('/api', (req, res, next) => {
  res.setHeader('x-database-mode', mongoose.connection.readyState === 1 ? 'mongodb' : 'mock-json');
  next();
});

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/users', userRoutes);

// Health check status
app.get('/', (req, res) => {
  res.json({ message: 'missUmovie REST API Service is online' });
});

// Handle unknown route targets
app.use((req, res, next) => {
  const error = new Error(`Target route not found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
});

// Bind error interceptor
app.use(errorMiddleware);

export default app;

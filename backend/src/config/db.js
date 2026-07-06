import mongoose from 'mongoose';
import { ENV } from './env.js';

export async function connectDB() {
  try {
    const conn = await mongoose.connect(ENV.MONGO_URI);
    console.log(`Database connected successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Database connection failure: ${error.message}`);
    process.exit(1);
  }
}

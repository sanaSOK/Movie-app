import dotenv from 'dotenv';
dotenv.config();

export const ENV = {
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/missumovie',
  JWT_SECRET: process.env.JWT_SECRET || 'fallback_secret_key_change_me_in_prod',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
};

// Log warning if JWT_SECRET is unset
if (!process.env.JWT_SECRET) {
  console.warn('WARNING: JWT_SECRET environment variable is missing, fallback used.');
}

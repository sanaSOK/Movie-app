import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { jwtConfig } from '../config/jwt.js';

export const authService = {
  async register(username, email, password) {
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      const error = new Error('Username or email already exists');
      error.statusCode = 400;
      throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    const token = jwtConfig.generateToken({ id: user._id, role: user.role });
    return {
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
      },
      token,
    };
  },

  async login(email, password) {
    const user = await User.findOne({ email });
    if (!user) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    const token = jwtConfig.generateToken({ id: user._id, role: user.role });
    return {
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
      },
      token,
    };
  },

  async getProfile(userId) {
    const user = await User.findById(userId).select('-password');
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }
    return user;
  },
};

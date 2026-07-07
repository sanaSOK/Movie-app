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

  async forgotPassword(email) {
    const user = await User.findOne({ email });
    if (!user) {
      const error = new Error('User with this email does not exist');
      error.statusCode = 404;
      throw error;
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    await User.findByIdAndUpdate(user._id, {
      resetPasswordOTP: otp,
      resetPasswordOTPExpires: expires,
    }, { new: true });

    console.log('\n\x1b[36m%s\x1b[0m', '------------------------------------------------------------');
    console.log('\x1b[36m%s\x1b[0m', `📬 [EMAIL SIMULATOR] Password Reset OTP for ${email}:`);
    console.log('\x1b[1m\x1b[33m%s\x1b[0m', `                    👉  ${otp}  👈`);
    console.log('\x1b[36m%s\x1b[0m', '------------------------------------------------------------\n');

    return { message: 'OTP sent successfully to email' };
  },

  async resetPassword(email, otp, newPassword) {
    const user = await User.findOne({ email });
    if (!user) {
      const error = new Error('User with this email does not exist');
      error.statusCode = 404;
      throw error;
    }

    if (!user.resetPasswordOTP || user.resetPasswordOTP !== otp) {
      const error = new Error('Invalid OTP');
      error.statusCode = 400;
      throw error;
    }

    const isExpired = new Date() > new Date(user.resetPasswordOTPExpires);
    if (isExpired) {
      const error = new Error('OTP has expired');
      error.statusCode = 400;
      throw error;
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await User.findByIdAndUpdate(user._id, {
      password: hashedPassword,
      resetPasswordOTP: null,
      resetPasswordOTPExpires: null,
    }, { new: true });

    return { message: 'Password has been reset successfully' };
  }
};

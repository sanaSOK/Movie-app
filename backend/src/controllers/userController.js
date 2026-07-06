import { User } from '../models/User.js';
import { ResponseHelper } from '../utils/response.js';

export const userController = {
  async updateProfile(req, res, next) {
    try {
      const { username, avatar } = req.body;
      const updateData = {};

      if (username) updateData.username = username;
      if (avatar) updateData.avatar = avatar;

      // Handle profile picture file path if uploaded
      if (req.file) {
        updateData.avatar = `/uploads/${req.file.filename}`;
      }

      const user = await User.findByIdAndUpdate(
        req.user.id,
        { $set: updateData },
        { new: true, runValidators: true }
      ).select('-password');

      if (!user) {
        return ResponseHelper.error(res, 'User not found', 404);
      }

      return ResponseHelper.success(res, user, 'Profile details updated successfully');
    } catch (error) {
      next(error);
    }
  },
};

import User from '../models/User.js';
import Patient from '../models/Patient.js';
import Doctor from '../models/Doctor.js';
import Staff from '../models/Staff.js';
import { generateToken } from '../middleware/auth.js';
import logger from '../utils/logger.js';

/**
 * Authentication service
 */
export const authService = {
  /**
   * Register a new user
   */
  async register(userData, role = 'PATIENT') {
    try {
      // Check if user exists
      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        const error = new Error('User already exists');
        error.statusCode = 400;
        throw error;
      }

      // Prepare user data
      const userPayload = {
        ...userData,
        role,
      };

      // Create user based on role
      let user;
      if (role === 'PATIENT') {
        user = await Patient.create(userPayload);
      } else if (role === 'DOCTOR') {
        user = await Doctor.create(userPayload);
      } else if (role === 'STAFF') {
        user = await Staff.create(userPayload);
      } else {
        user = await User.create(userPayload);
      }

      logger.info(`New ${role} registered: ${user.email}`);
      return user;
    } catch (error) {
      logger.error('Registration error:', error.message);
      throw error;
    }
  },

  /**
   * Login user
   */
  async login(email, password) {
    try {
      // Find user with password field
      const user = await User.findOne({ email }).select('+password');
      if (!user) {
        const error = new Error('Invalid email or password');
        error.statusCode = 401;
        throw error;
      }

      // Check password
      const isPasswordValid = await user.matchPassword(password);
      if (!isPasswordValid) {
        const error = new Error('Invalid email or password');
        error.statusCode = 401;
        throw error;
      }

      // Update last login
      user.lastLogin = new Date();
      await user.save();

      // Generate token
      const token = generateToken(user._id, user.role);

      logger.info(`User logged in: ${user.email}`);
      return {
        user: user.toJSON(),
        token,
      };
    } catch (error) {
      logger.error('Login error:', error.message);
      throw error;
    }
  },

  /**
   * Get user by ID
   */
  async getUserById(userId) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        const error = new Error('User not found');
        error.statusCode = 404;
        throw error;
      }
      return user;
    } catch (error) {
      logger.error('Get user error:', error.message);
      throw error;
    }
  },

  /**
   * Update user profile
   */
  async updateProfile(userId, updateData) {
    try {
      const user = await User.findByIdAndUpdate(userId, updateData, {
        new: true,
        runValidators: true,
      });

      if (!user) {
        const error = new Error('User not found');
        error.statusCode = 404;
        throw error;
      }

      logger.info(`User profile updated: ${user.email}`);
      return user;
    } catch (error) {
      logger.error('Update profile error:', error.message);
      throw error;
    }
  },

  /**
   * Change password
   */
  async changePassword(userId, oldPassword, newPassword) {
    try {
      const user = await User.findById(userId).select('+password');
      if (!user) {
        const error = new Error('User not found');
        error.statusCode = 404;
        throw error;
      }

      // Verify old password
      const isPasswordValid = await user.matchPassword(oldPassword);
      if (!isPasswordValid) {
        const error = new Error('Invalid current password');
        error.statusCode = 401;
        throw error;
      }

      // Update password
      user.password = newPassword;
      await user.save();

      logger.info(`Password changed for user: ${user.email}`);
      return { message: 'Password changed successfully' };
    } catch (error) {
      logger.error('Change password error:', error.message);
      throw error;
    }
  },
};

export default authService;

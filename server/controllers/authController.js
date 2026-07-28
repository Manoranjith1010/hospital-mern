import { asyncHandler } from '../middleware/errorHandler.js';
import authService from '../services/authService.js';
import { validateAgainstSchema, validationSchemas } from '../validators/index.js';
import logger from '../utils/logger.js';

/**
 * Authentication controller
 */

/**
 * @desc Register a new user
 * @route POST /api/auth/register
 * @access Public
 */
export const register = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password, phone, role } = req.body;

  // Validate required fields
  if (!firstName || !lastName || !email || !password || !phone) {
    return res.status(400).json({
      success: false,
      message: 'Please provide all required fields',
    });
  }

  // Validate against schema
  const validation = validateAgainstSchema(
    { firstName, lastName, email, password, phone },
    validationSchemas.userRegistration,
  );

  if (!validation.isValid) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: validation.errors,
    });
  }

  const userRole = role || 'PATIENT';
  const user = await authService.register(
    { firstName, lastName, email, password, phone },
    userRole,
  );

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: user,
  });
});

/**
 * @desc Login user
 * @route POST /api/auth/login
 * @access Public
 */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate required fields
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide email and password',
    });
  }

  const { user, token } = await authService.login(email, password);

  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: {
      user,
      token,
    },
  });
});

/**
 * @desc Get current user profile
 * @route GET /api/auth/profile
 * @access Private
 */
export const getProfile = asyncHandler(async (req, res) => {
  const user = await authService.getUserById(req.user.userId);

  res.status(200).json({
    success: true,
    data: user,
  });
});

/**
 * @desc Update user profile
 * @route PUT /api/auth/profile
 * @access Private
 */
export const updateProfile = asyncHandler(async (req, res) => {
  const { firstName, lastName, phone, profileImage } = req.body;
  const updateData = {};

  if (firstName) updateData.firstName = firstName;
  if (lastName) updateData.lastName = lastName;
  if (phone) updateData.phone = phone;
  if (profileImage) updateData.profileImage = profileImage;

  const user = await authService.updateProfile(req.user.userId, updateData);

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: user,
  });
});

/**
 * @desc Change password
 * @route POST /api/auth/change-password
 * @access Private
 */
export const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;

  // Validate required fields
  if (!oldPassword || !newPassword || !confirmPassword) {
    return res.status(400).json({
      success: false,
      message: 'Please provide all required fields',
    });
  }

  // Validate passwords match
  if (newPassword !== confirmPassword) {
    return res.status(400).json({
      success: false,
      message: 'Passwords do not match',
    });
  }

  const result = await authService.changePassword(req.user.userId, oldPassword, newPassword);

  res.status(200).json({
    success: true,
    message: result.message,
  });
});

export default {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
};

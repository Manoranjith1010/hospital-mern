/**
 * Validation utilities
 */

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 number
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
  return passwordRegex.test(password);
};

export const validatePhone = (phone) => {
  const phoneRegex = /^\+?[0-9\s\-()]{10,}$/;
  return phoneRegex.test(phone);
};

export const validateTime = (time) => {
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(time);
};

export const getPasswordStrength = (password) => {
  let strength = 0;
  if (!password) return strength;

  if (password.length >= 8) strength += 1;
  if (password.length >= 12) strength += 1;
  if (/[a-z]/.test(password)) strength += 1;
  if (/[A-Z]/.test(password)) strength += 1;
  if (/\d/.test(password)) strength += 1;
  if (/[!@#$%^&*]/.test(password)) strength += 1;

  return Math.min(strength, 5);
};

export const getPasswordStrengthText = (strength) => {
  const texts = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
  return texts[strength] || 'Unknown';
};

export const getPasswordStrengthColor = (strength) => {
  const colors = ['text-red-600', 'text-orange-600', 'text-yellow-600', 'text-lime-600', 'text-green-600', 'text-emerald-600'];
  return colors[strength] || 'text-gray-600';
};

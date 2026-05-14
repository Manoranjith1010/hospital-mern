/**
 * Utility helper functions
 */

/**
 * Format date to readable string
 */
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Format time to HH:mm format
 */
export const formatTime = (time) => {
  if (!time) return '';
  const [hours, minutes] = time.split(':');
  return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
};

/**
 * Calculate age from date of birth
 */
export const calculateAge = (dob) => {
  const today = new Date();
  let age = today.getFullYear() - new Date(dob).getFullYear();
  const monthDiff = today.getMonth() - new Date(dob).getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < new Date(dob).getDate())) {
    age -= 1;
  }
  return age;
};

/**
 * Generate unique ID
 */
export const generateUniqueId = (prefix = '') => {
  return `${prefix}${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Capitalize first letter
 */
export const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Sanitize object - remove sensitive fields
 */
export const sanitizeObject = (obj, fieldsToRemove = ['password', '__v']) => {
  const sanitized = { ...obj };
  fieldsToRemove.forEach((field) => {
    delete sanitized[field];
  });
  return sanitized;
};

/**
 * Check if time slots overlap
 */
export const checkTimeOverlap = (start1, end1, start2, end2) => {
  return start1 < end2 && start2 < end1;
};

/**
 * Get working hours for a day
 */
export const getWorkingHours = (availability, dayOfWeek) => {
  const day = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][
    dayOfWeek
  ];
  const dayAvailability = availability[day];
  return dayAvailability?.isAvailable
    ? {
        startTime: dayAvailability.startTime,
        endTime: dayAvailability.endTime,
      }
    : null;
};

/**
 * Validate appointment time within working hours
 */
export const isWithinWorkingHours = (time, startTime, endTime) => {
  const [appointmentHours, appointmentMinutes] = time.split(':').map(Number);
  const [startHours, startMinutes] = startTime.split(':').map(Number);
  const [endHours, endMinutes] = endTime.split(':').map(Number);

  const appointmentTotalMinutes = appointmentHours * 60 + appointmentMinutes;
  const startTotalMinutes = startHours * 60 + startMinutes;
  const endTotalMinutes = endHours * 60 + endMinutes;

  return appointmentTotalMinutes >= startTotalMinutes && appointmentTotalMinutes < endTotalMinutes;
};

/**
 * Parse pagination parameters
 */
export const getPaginationParams = (query) => {
  const page = Math.max(1, parseInt(query.page || '1', 10));
  const limit = Math.min(parseInt(query.limit || '10', 10), 100);
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

/**
 * Sort fields for query
 */
export const getSortFields = (sortBy = 'createdAt') => {
  const isDescending = sortBy.startsWith('-');
  const field = isDescending ? sortBy.substring(1) : sortBy;
  return { [field]: isDescending ? -1 : 1 };
};

/**
 * Build query filter
 */
export const buildQueryFilter = (query, allowedFields) => {
  const filter = {};
  allowedFields.forEach((field) => {
    if (query[field]) {
      filter[field] = query[field];
    }
  });
  return filter;
};

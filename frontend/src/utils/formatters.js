import { formatDistanceToNow, format } from 'date-fns';

/**
 * Format date for display
 */
export const formatDate = (date, formatString = 'MMM dd, yyyy') => {
  if (!date) return '';
  return format(new Date(date), formatString);
};

/**
 * Format time for display
 */
export const formatTime = (time) => {
  if (!time) return '';
  const [hours, minutes] = time.split(':');
  return `${hours}:${minutes}`;
};

/**
 * Get relative time (e.g., "2 hours ago")
 */
export const getRelativeTime = (date) => {
  if (!date) return '';
  return formatDistanceToNow(new Date(date), { addSuffix: true });
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
 * Check if date is today
 */
export const isToday = (date) => {
  const today = new Date();
  const checkDate = new Date(date);
  return (
    checkDate.getDate() === today.getDate() &&
    checkDate.getMonth() === today.getMonth() &&
    checkDate.getFullYear() === today.getFullYear()
  );
};

/**
 * Check if date is in the future
 */
export const isFutureDate = (date) => {
  return new Date(date) > new Date();
};

/**
 * Get status color
 */
export const getStatusColor = (status) => {
  const colors = {
    SCHEDULED: 'bg-blue-100 text-blue-800',
    IN_PROGRESS: 'bg-yellow-100 text-yellow-800',
    COMPLETED: 'bg-green-100 text-green-800',
    CANCELLED: 'bg-red-100 text-red-800',
    RESCHEDULED: 'bg-purple-100 text-purple-800',
    PENDING: 'bg-orange-100 text-orange-800',
    APPROVED: 'bg-green-100 text-green-800',
    REJECTED: 'bg-red-100 text-red-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

/**
 * Get role display text
 */
export const getRoleDisplay = (role) => {
  const roleMap = {
    ADMIN: 'Administrator',
    DOCTOR: 'Doctor',
    PATIENT: 'Patient',
    STAFF: 'Staff',
  };
  return roleMap[role] || role;
};

/**
 * Truncate text
 */
export const truncateText = (text, length = 50) => {
  if (!text) return '';
  return text.length > length ? `${text.substring(0, length)}...` : text;
};

/**
 * Format currency
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

/**
 * Get initials from name
 */
export const getInitials = (firstName = '', lastName = '') => {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
};

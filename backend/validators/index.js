import validator from 'validator';

/**
 * Custom validation functions
 */
export const validateEmail = (email) => {
  if (!validator.isEmail(email)) {
    throw new Error('Invalid email format');
  }
  return true;
};

export const validatePhone = (phone) => {
  if (!validator.isMobilePhone(phone, 'any', { strictMode: false })) {
    throw new Error('Invalid phone number');
  }
  return true;
};

export const validatePassword = (password) => {
  if (password.length < 8) {
    throw new Error('Password must be at least 8 characters');
  }
  if (!/[A-Z]/.test(password)) {
    throw new Error('Password must contain at least one uppercase letter');
  }
  if (!/[0-9]/.test(password)) {
    throw new Error('Password must contain at least one number');
  }
  return true;
};

export const validateDateOfBirth = (dob) => {
  const date = new Date(dob);
  const age = new Date().getFullYear() - date.getFullYear();
  if (age < 18 || age > 120) {
    throw new Error('Invalid date of birth');
  }
  return true;
};

export const validateLicenseNumber = (license) => {
  if (license.length < 5) {
    throw new Error('Invalid license number');
  }
  return true;
};

/**
 * Validation schemas
 */
export const validationSchemas = {
  // User registration/login validation
  userRegistration: {
    firstName: (val) => val && val.length >= 2 && val.length <= 50,
    lastName: (val) => val && val.length >= 2 && val.length <= 50,
    email: (val) => validator.isEmail(val),
    password: (val) => {
      try {
        validatePassword(val);
        return true;
      } catch {
        return false;
      }
    },
    phone: (val) => validator.isMobilePhone(val, 'any', { strictMode: false }),
  },

  // Patient registration validation
  patientRegistration: {
    dateOfBirth: (val) => {
      try {
        validateDateOfBirth(val);
        return true;
      } catch {
        return false;
      }
    },
    gender: (val) => ['MALE', 'FEMALE', 'OTHER'].includes(val),
    bloodType: (val) => ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].includes(val),
  },

  // Doctor registration validation
  doctorRegistration: {
    specialization: (val) => [
      'CARDIOLOGY',
      'NEUROLOGY',
      'ORTHOPEDICS',
      'DERMATOLOGY',
      'PEDIATRICS',
      'PSYCHIATRY',
      'ONCOLOGY',
      'GENERAL',
      'ENT',
      'OPHTHALMOLOGY',
    ].includes(val),
    licenseNumber: (val) => val && val.length >= 5,
    yearsOfExperience: (val) => Number.isInteger(val) && val >= 0,
    consultationFee: (val) => !Number.isNaN(val) && val > 0,
  },

  // Appointment validation
  appointmentCreation: {
    appointmentDate: (val) => new Date(val) > new Date(),
    appointmentTime: (val) => /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(val),
    reason: (val) => val && val.length >= 10,
    duration: (val) => Number.isInteger(val) && val >= 15 && val <= 120,
  },
};

/**
 * Validate object against schema
 */
export const validateAgainstSchema = (obj, schema) => {
  const errors = [];
  Object.keys(schema).forEach((key) => {
    if (obj[key] !== undefined && !schema[key](obj[key])) {
      errors.push(`Invalid ${key}`);
    }
  });
  return {
    isValid: errors.length === 0,
    errors,
  };
};

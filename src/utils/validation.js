/**
 * Validate email format
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 */
export const isStrongPassword = (password) => {
  // At least 8 characters, with at least one number
  return password.length >= 8 && /\d/.test(password);
};

/**
 * Validate registration data
 */
export const validateRegistration = (data) => {
  const errors = {};
  
  if (!data.username || data.username.trim() === "") {
    errors.username = "Username is required";
  }
  
  if (!data.email) {
    errors.email = "Email is required";
  } else if (!isValidEmail(data.email)) {
    errors.email = "Invalid email format";
  }
  
  if (!data.password) {
    errors.password = "Password is required";
  } else if (!isStrongPassword(data.password)) {
    errors.password = "Password must be at least 8 characters and contain a number";
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
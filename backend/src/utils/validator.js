export const Validator = {
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  validateSignup(data) {
    const errors = {};
    if (!data.username || data.username.trim().length < 3) {
      errors.username = 'Username must be at least 3 characters long';
    }
    if (!data.email || !this.isValidEmail(data.email)) {
      errors.email = 'Please provide a valid email address';
    }
    if (!data.password || data.password.length < 6) {
      errors.password = 'Password must be at least 6 characters long';
    }
    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  },
};

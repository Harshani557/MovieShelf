const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const validateName = (name) =>
  name.trim().length < 2 ? 'Name must be at least 2 characters.' : '';

export const validateEmail = (email) =>
  EMAIL_PATTERN.test(email.trim()) ? '' : 'Please enter a valid email address.';

export const validatePassword = (password) =>
  password.length < 6 ? 'Password must be at least 6 characters.' : '';

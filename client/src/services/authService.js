// src/services/authService.js
import API from './api';

// Register a new user
export const register = (data) => {
  return API.post('/auth/register', data)
    .catch((err) => {
      console.error("❌ Registration failed:", err.response?.data || err.message);
      throw err;
    });
};

// Login existing user
export const login = (data) => {
  return API.post('/auth/login', data)
    .catch((err) => {
      console.error("❌ Login failed:", err.response?.data || err.message);
      throw err;
    });
};

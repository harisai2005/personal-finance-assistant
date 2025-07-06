// src/services/api.js
import axios from 'axios';

// Create a centralized axios instance
const API = axios.create({
  baseURL: 'https://personal-finance-assistant-n8lv.onrender.com', // 🔗 Base URL for all backend endpoints
});

// Attach auth token to each request if present
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    console.log("📡 Attaching token to request headers...");
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  console.error("❌ API Request Error:", error);
  return Promise.reject(error);
});

export default API;

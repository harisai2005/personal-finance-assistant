// src/services/api.js
import axios from 'axios';

// 🌐 Determine base URL dynamically
const isLocal = window.location.hostname === 'localhost';
const baseURL = isLocal
  ? 'http://localhost:5000/api'
  : `${window.location.origin}/api`; // Fallback for deployed env

// 🛠️ Create centralized Axios instance
const API = axios.create({ baseURL });

// 🔐 Attach token to each request
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      console.log("📡 Attaching token to request headers...");
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("❌ API Request Error:", error);
    return Promise.reject(error);
  }
);

export default API;

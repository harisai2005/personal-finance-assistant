// src/services/api.js
import axios from 'axios';

// 🌍 Always point to deployed backend
const baseURL = 'https://personal-finance-assistant-n8lv.onrender.com/api'; // ✅ your backend API base

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

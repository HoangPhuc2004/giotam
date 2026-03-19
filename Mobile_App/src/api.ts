import axios from 'axios';

// URL backend sẽ tự động chọn dựa trên môi trường:
// - Development (.env.development): http://localhost:5000
// - Production (.env.production): https://giotam-backend.onrender.com
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const api = axios.create({
  baseURL: API_URL,
  timeout: 60000, // 60s – Render free tier cần đến 50s để cold-start
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': '69420',
  },
});

// Tự động gắn Token nếu user đã đăng nhập
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
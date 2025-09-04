import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_URL_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

console.log('🔧 Configuración de API:', {
  baseURL: import.meta.env.VITE_URL_BASE,
  env: import.meta.env
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("TokenLeu");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;

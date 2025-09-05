import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_URL_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

// console.log('🔧 Configuración de API:', {
//   baseURL: import.meta.env.VITE_URL_BASE,
//   env: import.meta.env
// });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("TokenLeu");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // console.log('📤 Petición enviada:', {
  //   method: config.method?.toUpperCase(),
  //   url: config.url,
  //   baseURL: config.baseURL,
  //   data: config.data,
  //   headers: config.headers
  // });

  return config;
});

api.interceptors.response.use(
  (response) => {
    // console.log('📥 Respuesta recibida:', {
    //   status: response.status,
    //   url: response.config.url,
    //   data: response.data
    // });
    return response;
  },
  (error) => {
    // console.error('❌ Error en interceptor de respuesta:', {
    //   status: error.response?.status,
    //   statusText: error.response?.statusText,
    //   url: error.config?.url,
    //   data: error.response?.data,
    //   message: error.message
    // });
    return Promise.reject(error);
  }
);

export default api;

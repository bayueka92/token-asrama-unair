// src/services/apiClient.ts

import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:3001/api', // Pastikan URL ini sesuai dengan backend Anda
});

// Interceptor untuk menambahkan token otorisasi ke setiap request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor untuk menangani error 401 (Unauthorized) secara global
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Jika token tidak valid atau kedaluwarsa, server akan merespons dengan 401
    if (error.response && error.response.status === 401) {
      // Hapus token yang tidak valid dari penyimpanan
      localStorage.removeItem('authToken');
      // Arahkan pengguna kembali ke halaman login untuk mencegah loop error
      window.location.href = '/login?session=expired';
    }
    return Promise.reject(error);
  }
);

export default apiClient;

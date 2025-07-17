// src/services/authService.ts

import apiClient from './apiClient'; // <-- Gunakan apiClient terpusat
import { LoginCredentials, AuthResponse } from '../types'; // Asumsi Anda punya file types.ts

/**
 * Mengirim kredensial login ke backend.
 * Menggunakan apiClient agar konsisten, meskipun interceptor token belum relevan di sini.
 */
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post<AuthResponse>('/login', credentials);
    return response.data;
  } catch (error) {
    // Biarkan komponen yang memanggil (LoginForm) menangani UI error
    throw error;
  }
};

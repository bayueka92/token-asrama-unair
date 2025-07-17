// src/services/uploadService.ts

import apiClient from './apiClient'; // apiClient utama untuk baseURL dan interceptor
import axios from 'axios'; // Import axios secara langsung

/**
 * Mengunggah file gambar ke server.
 * @param imageFile File gambar yang akan diunggah.
 * @returns Promise yang resolve dengan URL dan nama file dari gambar yang diunggah.
 */
export const uploadImage = async (imageFile: File): Promise<{ url: string; filename: string }> => {
  const formData = new FormData();
  // 'image' adalah key yang diharapkan oleh backend
  formData.append('image', imageFile);

  try {
    // ===================================================================
    // == PERBAIKAN UTAMA ADA DI SINI ==
    // Karena error 400 Bad Request tetap terjadi, ini menandakan ada
    // kemungkinan konfigurasi header global ('Content-Type': 'application/json')
    // di dalam apiClient Anda yang mengganggu.
    //
    // Solusi paling andal adalah membuat instance axios baru yang bersih
    // khusus untuk unggahan ini. Ini akan mengabaikan header global yang
    // salah dan membiarkan axios mengatur header 'multipart/form-data'
    // dengan benar secara otomatis.
    // ===================================================================

    // 1. Buat instance axios sementara yang bersih
    const uploadClient = axios.create({
      baseURL: apiClient.defaults.baseURL, // Ambil baseURL dari apiClient utama
    });

    // 2. Ambil token secara manual untuk ditambahkan ke header instance sementara
    const token = localStorage.getItem('authToken');
    const headers: { [key: string]: string } = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // 3. Lakukan request dengan instance dan header yang bersih
    const response = await uploadClient.post('/files/image', formData, { headers });
    
    return response.data;
    
  } catch (error) {
    console.error('Proses upload gambar gagal:', error);
    // Lemparkan error agar bisa ditangkap oleh komponen yang memanggil
    throw error;
  }
};

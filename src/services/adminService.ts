// src/services/adminService.ts

import apiClient from './apiClient'; // <-- Gunakan apiClient terpusat
import { Admin } from '../types';

// Tipe data untuk payload, bisa Anda letakkan di types.ts
interface AdminPayload {
  name: string;
  email: string;
  role: 'admin' | 'operator';
  password?: string;
  avatar?: string;
}

/**
 * Mengambil daftar semua admin dan operator dari server.
 */
export const fetchAdmins = async (): Promise<Admin[]> => {
  const response = await apiClient.get('/admins');
  return response.data;
};

/**
 * Membuat user baru (admin/operator).
 */
export const createAdmin = async (data: AdminPayload): Promise<Admin> => {
  const response = await apiClient.post('/admins', data);
  return response.data;
};

/**
 * Memperbarui data user yang ada.
 */
export const updateAdmin = async (id: number, data: AdminPayload): Promise<Admin> => {
  const response = await apiClient.put(`/admins/${id}`, data);
  return response.data;
};

/**
 * Menghapus user.
 */
export const deleteAdmin = async (id: number): Promise<void> => {
  await apiClient.delete(`/admins/${id}`);
};

/**
 * Mengubah status aktif/nonaktif seorang user.
 */
export const toggleAdminStatus = async (id: number): Promise<Admin> => {
  const response = await apiClient.patch(`/admins/${id}/status`);
  return response.data;
};

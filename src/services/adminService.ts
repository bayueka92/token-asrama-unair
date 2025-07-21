import apiClient from './apiClient';
import { Admin } from '../types';

interface AdminPayload {
  name: string;
  email: string;
  role: 'admin' | 'operator';
  password?: string;
  avatar?: string;
}

export const fetchAdmins = async (): Promise<Admin[]> => {
  const response = await apiClient.get('/admins');
  return response.data;
};

export const createAdmin = async (data: AdminPayload): Promise<Admin> => {
  const response = await apiClient.post('/admins', data);
  return response.data;
};

export const updateAdmin = async (id: number, data: AdminPayload): Promise<Admin> => {
  const response = await apiClient.put(`/admins/${id}`, data);
  return response.data;
};

export const deleteAdmin = async (id: number): Promise<void> => {
  await apiClient.delete(`/admins/${id}`);
};

export const toggleAdminStatus = async (id: number): Promise<Admin> => {
  const response = await apiClient.patch(`/admins/${id}/status`);
  return response.data;
};

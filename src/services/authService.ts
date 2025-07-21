import apiClient from './apiClient';
import { LoginCredentials, AuthResponse } from '../types';


export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>('/login', credentials);
  return response.data;
};

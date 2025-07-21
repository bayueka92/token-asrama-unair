import apiClient from './apiClient';
import axios from 'axios';

export const uploadImage = async (imageFile: File): Promise<{ url: string; filename: string }> => {
  const formData = new FormData();
  formData.append('image', imageFile);

  try {
    const uploadClient = axios.create({
      baseURL: apiClient.defaults.baseURL,
    });

    const token = localStorage.getItem('authToken');
    const headers: { [key: string]: string } = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await uploadClient.post('/files/image', formData, { headers });
    
    return response.data;
    
  } catch (error) {
    console.error('Proses upload gambar gagal:', error);
    throw error;
  }
};

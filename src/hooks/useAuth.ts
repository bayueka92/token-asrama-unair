import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext'; // Impor context dari file aslinya

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth harus digunakan di dalam AuthProvider');
  }
  return context;
};
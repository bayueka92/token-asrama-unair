// src/components/Login/LoginForm.tsx

import React, { useState, useEffect } from 'react';
import { Zap, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import * as authService from '../../services/authService'; // <-- IMPORT SERVICE BARU

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // ===================================================================
  // == PERBAIKAN 1: Sesuaikan dengan AuthContext ==
  // Hanya butuh 'login' dan 'authState'
  // ===================================================================
  const { login, authState } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // ===================================================================
    // == PERBAIKAN 2: Gunakan 'authState.token' untuk memeriksa login ==
    // ===================================================================
    // Jika sudah ada token, langsung arahkan ke dashboard
    if (authState.token) {
      navigate('/dashboard');
    }
  }, [authState.token, navigate]);

  useEffect(() => {
    // Logika untuk menangani token dari URL (misal: setelah login Google)
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    if (token) {
      // ===================================================================
      // == PERBAIKAN 3: Gunakan fungsi 'login' yang sudah ada ==
      // ===================================================================
      login(token); 
      // Hapus token dari URL agar tidak terlihat
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, [login]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // ===================================================================
      // == PERBAIKAN 4 (UTAMA): Logika login yang benar ==
      // 1. Panggil service untuk mendapatkan token dari API.
      // 2. Jika berhasil, teruskan token ke fungsi login() dari context.
      // ===================================================================
      const response = await authService.login({ email, password });
      login(response.token); // <-- Teruskan HANYA token (string)
      
      navigate('/dashboard');

    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        const errorCode = err.response.data.error_code;
        if (errorCode === 'account_inactive') {
          Swal.fire({
            icon: 'error', title: 'Login Gagal',
            text: 'Akun Anda telah dinonaktifkan. Silahkan hubungi administrator.',
          });
        } else {
          setError('Email atau password yang Anda masukkan salah.');
        }
      } else {
        setError('Terjadi kesalahan pada server. Coba lagi beberapa saat.');
      }
    } finally {
      setLoading(false);
    }
  };

  // const handleGoogleLogin = () => {
  //   window.location.href = 'http://localhost:3001/auth/google';
  // };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500 rounded-full mb-4">
            <Zap className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Admin Panel</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Token Listrik ASRAMA UNAIR</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white" placeholder="admin@unair.ac.id" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Password</label>
            <div className="relative">
              <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white" placeholder="••••••••" required />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>
          <button type="submit" disabled={loading} className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center justify-center">
            {loading ? <><Loader2 className="animate-spin h-5 w-5 mr-2" /> Masuk...</> : 'Masuk'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;

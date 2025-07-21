// src/components/Login/LoginForm.tsx

import React, { useState, useEffect } from 'react';
import { Zap, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth'; // Pastikan path ini benar!
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
// HAPUS import ini karena AuthContext yang akan menangani panggilan API
// import * as authService from '../../services/authService'; 

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login, authState } = useAuth(); // Ambil fungsi login dan authState dari context
  const navigate = useNavigate();

  useEffect(() => {
    // Jika sudah ada token (berarti sudah login), langsung arahkan ke dashboard
    if (authState.token) {
      navigate('/dashboard');
    }
  }, [authState.token, navigate]);

  useEffect(() => {
    // Logika untuk menangani token dari URL (misal: setelah login Google)
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    if (token) {
      // PERHATIAN: Jika Google Login Anda mengembalikan token ke URL,
      // Anda perlu fungsi *lain* di AuthContext untuk menerima token ini dan memprosesnya.
      // Fungsi `login` yang ada sekarang hanya untuk login email/password.
      // Jika tidak ada skenario Google Login, Anda bisa hapus useEffect ini.
      // Untuk sementara, kita biarkan saja, tapi pastikan alur Google Login Anda jelas.
      console.warn("Menerima token dari URL. Anda mungkin perlu fungsi `loginWithToken` di AuthContext.");
      window.history.replaceState(null, '', window.location.pathname); 
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // Panggil fungsi `login` dari AuthContext dengan email dan password.
      // Fungsi ini akan melakukan panggilan API ke backend.
      const success = await login(email, password); 

      if (!success) {
        // Jika fungsi login di AuthContext mengembalikan false (gagal),
        // maka tampilkan pesan error.
        setError('Email atau password yang Anda masukkan salah.');
      }
      // Jika success, navigasi sudah ditangani oleh AuthContext
      // navigate('/dashboard'); // <-- Ini sudah ada di AuthContext, jadi bisa dihilangkan di sini
    } catch (err) {
      // Ini adalah catch-all jika ada error yang tidak tertangkap oleh AuthContext
      // Misalnya, masalah koneksi atau error Axios yang tidak ditangani di AuthContext.
      if (axios.isAxiosError(err) && err.response) {
        const errorCode = err.response.data.error_code;
        if (errorCode === 'account_inactive') {
          Swal.fire({
            icon: 'error', title: 'Login Gagal',
            text: 'Akun Anda telah dinonaktifkan. Silahkan hubungi administrator.',
          });
        } else {
          // Pesan error umum jika tidak ada kode error spesifik
          setError('Terjadi kesalahan saat login. Coba lagi.');
        }
      } else {
        setError('Terjadi kesalahan pada server. Coba lagi beberapa saat.');
      }
    } finally {
      setLoading(false);
    }
  };

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
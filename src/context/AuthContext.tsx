// src/context/AuthContext.tsx

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';

// Definisikan struktur data user yang kita dapat dari token
interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'operator';
  avatar?: string;
  exp?: number;
}

// Definisikan apa saja yang akan disediakan oleh context
interface AuthContextType {
  authState: {
    token: string | null;
    user: AuthUser | null;
  };
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<{ token: string | null; user: AuthUser | null }>({
    token: null,
    user: null,
  });

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const decodedUser: AuthUser = jwtDecode(token);
        if (decodedUser.exp && decodedUser.exp * 1000 < Date.now()) {
          localStorage.removeItem('authToken');
          setAuthState({ token: null, user: null });
        } else {
          setAuthState({ token, user: decodedUser });
        }
      } catch (error) {
        localStorage.removeItem('authToken');
        setAuthState({ token: null, user: null });
      }
    }
  }, []);

  const login = (token: string) => {
    if (typeof token !== 'string' || !token) {
      console.error("Gagal login: Fungsi login menerima nilai yang bukan string.");
      return;
    }
    try {
      const decodedUser: AuthUser = jwtDecode(token);
      localStorage.setItem('authToken', token);
      setAuthState({ token, user: decodedUser });
    } catch (error) {
      console.error("Gagal decode token saat login:", error);
    }
  };

  // ===================================================================
  // == PERBAIKAN UTAMA ADA DI SINI ==
  // Fungsi logout sekarang melakukan tiga hal penting:
  // 1. Menghapus token dari localStorage.
  // 2. Mengatur state aplikasi menjadi tidak terotentikasi.
  // 3. Memaksa refresh halaman ke rute /login, yang akan membersihkan
  //    semua state lama dan mencegah redirect kembali ke dashboard.
  // ===================================================================
  const logout = () => {
    localStorage.removeItem('authToken');
    setAuthState({ token: null, user: null });
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth harus digunakan di dalam AuthProvider');
  }
  return context;
};

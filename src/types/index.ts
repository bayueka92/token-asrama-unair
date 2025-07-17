// src/types.ts

// Tipe data untuk user biasa
export interface User {
  id: string;
  name: string;
  email: string;
  nim: string;
  asrama: string;
  room: string;
  balance: number;
  createdAt: string;
  status: 'active' | 'inactive';
  totalPurchases: number;
}

// Tipe data untuk Admin & Operator (sudah diperbarui)
export interface Admin {
  id: number; // ID dari backend adalah number
  name: string;
  email: string;
  avatar?: string; // <-- DITAMBAHKAN: URL untuk foto profil (opsional)
  role: 'admin' | 'operator';
  createdAt: string;
  lastLogin?: string | null;
  status: 'active' | 'inactive';
  updatedAt: string;
}

// Tipe data untuk harga token
export interface TokenPrice {
  id: string;
  amount: number;
  kwh: number;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

// Tipe data untuk riwayat pembelian
export interface Purchase {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  kwh: number;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  tokenCode: string;
}

// Tipe data untuk statistik dashboard
export interface DashboardStats {
  totalUsers: number;
  totalPurchases: number;
  totalRevenue: number;
  totalKwh: number;
  monthlyData: { month: string; purchases: number; revenue: number }[];
  dailyData: { day: string; purchases: number; revenue: number }[];
}

// Tipe data untuk kredensial login
export interface LoginCredentials {
  email: string;
  password: string;
}

// Tipe data untuk state autentikasi
export interface AuthState {
  isLoggedIn: boolean;
  user: Admin | null;
  token: string | null;
}

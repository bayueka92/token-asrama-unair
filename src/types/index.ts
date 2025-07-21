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
export interface Admin {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'operator';
  createdAt: string;
  lastLogin?: string | null;
  status: 'active' | 'inactive';
  updatedAt: string;
}
export interface TokenPrice {
  id: string;
  amount: number;
  kwh: number;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}
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
export interface DashboardStats {
  totalUsers: number;
  totalPurchases: number;
  totalRevenue: number;
  totalKwh: number;
  monthlyData: { month: string; purchases: number; revenue: number }[];
  dailyData: { day: string; purchases: number; revenue: number }[];
}
export interface LoginCredentials {
  email: string;
  password: string;
}
export interface AuthState {
  isLoggedIn: boolean;
  user: Admin | null;
  token: string | null;
}
export interface AuthResponse {
  token: string;
}
export interface DecodedToken {
  sub: string;
  name: string;
  email: string;
  role: 'admin' | 'operator' | 'user';
  avatar?: string;
  exp: number;
  iat: number;
}

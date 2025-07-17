import React from 'react';
import {
  Home,
  Users,
  DollarSign,
  BarChart3,
  Settings,
  Shield,
  LogOut,
  Moon,
  Sun
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../hooks/useTheme';
import { NavLink } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/dashboard' },
    { id: 'users', label: 'Kelola User', icon: Users, path: '/users' },
    { id: 'tokens', label: 'Harga Token', icon: DollarSign, path: '/tokens' },
    { id: 'purchases', label: 'Pembelian', icon: BarChart3, path: '/purchases' },
    { id: 'admins', label: 'Admin & Operator', icon: Shield, path: '/admins' },
    { id: 'settings', label: 'Pengaturan', icon: Settings, path: '/settings' },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 h-full w-64 shadow-lg border-r border-gray-200 dark:border-gray-700 flex flex-col">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-xl font-bold text-gray-800 dark:text-white">
          Token Listrik UNAIR
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">Admin Panel</p>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`
                  }
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.label}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={toggleTheme}
          className="w-full flex items-center px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors mb-2"
        >
          {theme === 'light' ? (
            <Moon className="mr-3 h-5 w-5" />
          ) : (
            <Sun className="mr-3 h-5 w-5" />
          )}
          {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
        </button>

        <button
          onClick={logout}
          className="w-full flex items-center px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900 transition-colors"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Keluar
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

import React, { useState, useEffect, useCallback } from 'react';
import { Search, Edit, Trash2, Plus, Eye, Loader, AlertCircle, CheckCircle } from 'lucide-react';
import apiClient from '../../services/apiClient';
import axios from 'axios';
interface User {
  id: number;
  name: string;
  email: string;
  nim: string;
  dormitory: string;
  room: string;
  balance: number;
  totalPurchases: number;
  status: string;
  avatar?: string;
  provider?: string;
  providerID?: string;
  lastLogin?: string;
  createdAt?: string;
  updatedAt?: string;
}

const USER_ENDPOINT = '/users';

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.get(USER_ENDPOINT);
      setUsers(response.data.data);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        setError('Akses ditolak. Sesi Anda mungkin telah berakhir.');
      } else {
        setError('Gagal memuat data user. Silakan coba lagi.');
      }
      console.error('Failed to fetch users:', err);
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.nim && user.nim.includes(searchTerm))
  );

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const StatusBadge = ({ status }: { status: string }) => (
    <span className={`px-2 py-1 text-xs rounded-full ${
      status === 'active'
        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    }`}>
      {status === 'active' ? 'Aktif' : 'Nonaktif'}
    </span>
  );

  const handleDeleteUser = async (userId: number) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus user ini?')) return;

    setError(null);
    setSuccessMessage(null);
    try {
      await apiClient.delete(`${USER_ENDPOINT}/${userId}`);
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
      setSuccessMessage('User berhasil dihapus!');
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Gagal menghapus user. Silakan coba lagi.');
      }
      console.error('Failed to delete user:', err);
    } finally {
      setTimeout(() => setSuccessMessage(null), 3000);
    }
  };

  const handleEditUser = (user: User) => {
    console.log('Edit user:', user);
    setSuccessMessage('Fitur edit sedang dikembangkan.');
    setTimeout(() => setSuccessMessage(null), 3000);
  };


  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader className="animate-spin h-8 w-8 text-blue-500" />
        <p className="ml-3 text-gray-600 dark:text-gray-400">Memuat data user...</p>
      </div>
    );
  }

  if (error && !isLoading) {
    return (
      <div className="flex items-center text-sm text-red-600 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg mb-4">
        <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Kelola User</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Kelola data user asrama kampus UNAIR
          </p>
        </div>
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
          <Plus className="h-4 w-4" />
          <span>Tambah User</span>
        </button>
      </div>

      {successMessage && (
        <div className="flex items-center text-sm text-green-600 bg-green-50 dark:bg-green-900/20 p-3 rounded-lg mb-4">
          <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Cari user berdasarkan nama, email, atau NIM..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Asrama & Kamar
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Saldo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Pembelian
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredUsers.length === 0 && !isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    Tidak ada user ditemukan.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {user.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {user.email}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          NIM: {user.nim}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {/* Gunakan user.dormitory (dari backend) */}
                      <div className="text-sm text-gray-900 dark:text-white">{user.dormitory}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Kamar {user.room}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        Rp {user.balance.toLocaleString('id-ID')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {/* Gunakan user.status */}
                      <StatusBadge status={user.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {user.totalPurchases}x
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewUser(user)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleEditUser(user)} // Panggil handleEditUser
                          className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)} // Panggil handleDeleteUser
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Detail Modal */}
      {showModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Detail User
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Nama</label>
                <p className="text-gray-800 dark:text-white">{selectedUser.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Email</label>
                <p className="text-gray-800 dark:text-white">{selectedUser.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">NIM</label>
                <p className="text-gray-800 dark:text-white">{selectedUser.nim}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Asrama</label>
                <p className="text-gray-800 dark:text-white">{selectedUser.dormitory}</p> {/* Gunakan dormitory */}
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Kamar</label>
                <p className="text-gray-800 dark:text-white">{selectedUser.room}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Saldo</label>
                <p className="text-gray-800 dark:text-white">Rp {selectedUser.balance.toLocaleString('id-ID')}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Pembelian</label>
                <p className="text-gray-800 dark:text-white">{selectedUser.totalPurchases}x</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Status</label>
                <div className="mt-1">
                  <StatusBadge status={selectedUser.status} />
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
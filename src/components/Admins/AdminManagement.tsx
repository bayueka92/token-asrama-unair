// src/components/Admins/AdminManagement.tsx

import React, { useEffect, useState, useCallback } from 'react';
import { Plus, Edit, Trash2, Shield, User, Power, PowerOff, UploadCloud } from 'lucide-react';
import { Admin } from '../../types';
import * as adminService from '../../services/adminService';
import * as uploadService from '../../services/uploadService';
import Swal from 'sweetalert2';

// ===================================================================
// == PERUBAHAN KRUSIAL: Pastikan Impor Ini Benar ==
// Ini adalah penyebab paling umum dari masalah Anda. Pastikan Anda
// mengimpor `useAuth` dari file context yang benar, yaitu
// `../../context/AuthContext`, dan BUKAN dari file lama seperti
// `../../hooks/useAuth`.
// ===================================================================
import { useAuth } from '../../context/AuthContext';

// URL dasar backend Anda untuk menampilkan gambar
const API_HOST = 'http://localhost:3001';

// Komponen Badge (Tidak ada perubahan)
const StatusBadge = ({ status }: { status: 'active' | 'inactive' }) => (
  <span
    className={`px-2 py-1 text-xs font-semibold rounded-full ${
      status === 'active'
        ? 'bg-green-100 text-green-800'
        : 'bg-red-100 text-red-800'
    }`}
  >
    {status === 'active' ? 'Aktif' : 'Nonaktif'}
  </span>
);

const RoleBadge = ({ role }: { role: 'admin' | 'operator' }) => (
  <span
    className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${
      role === 'admin'
        ? 'bg-purple-100 text-purple-800'
        : 'bg-blue-100 text-blue-800'
    }`}
  >
    {role}
  </span>
);

const AdminManagement: React.FC = () => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'operator' as 'admin' | 'operator',
    password: '',
    avatar: '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // ===================================================================
  // == PEMANGGILAN KONTEKS ==
  // Ini mengambil state otentikasi. Jika `useAuth` diimpor dari
  // file yang salah, `authState.user` akan selalu null, dan
  // semua panggilan API yang memerlukan otorisasi akan gagal.
  // ===================================================================
  const { authState } = useAuth();
  const currentUserIsAdmin = authState.user?.role === 'admin';

  const loadAdmins = useCallback(async () => {
    try {
      // ===================================================================
      // == PEMANGGILAN SERVICE ==
      // Panggilan ini bergantung pada `adminService.ts` yang harus
      // menggunakan `apiClient` terpusat untuk menambahkan token otentikasi.
      // Jika tidak, server akan menolak permintaan ini (error 401 atau 403).
      // ===================================================================
      const data = await adminService.fetchAdmins();
      setAdmins(data);
    } catch (err) {
      // Jika Anda melihat pesan error ini, buka konsol browser Anda (di tab Network)
      // untuk melihat detail error dari server (misalnya 401, 403, 500).
      Swal.fire('Error', 'Gagal memuat data admin. Periksa konsol untuk detail.', 'error');
      console.error("Gagal memuat admin:", err);
    }
  }, []);

  useEffect(() => {
    // Memuat data saat komponen pertama kali ditampilkan
    loadAdmins();
  }, [loadAdmins]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const openModal = (admin: Admin | null) => {
    setEditingAdmin(admin);
    setFormData({
      name: admin?.name || '',
      email: admin?.email || '',
      role: admin?.role || 'operator',
      password: '',
      avatar: admin?.avatar || '',
    });
    setSelectedFile(null);
    setPreviewUrl(admin?.avatar ? `${API_HOST}${admin.avatar}` : null);
    setShowModal(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUserIsAdmin) return;
    setIsUploading(true);

    try {
      let avatarUrl = formData.avatar;

      if (selectedFile) {
        const uploadResponse = await uploadService.uploadImage(selectedFile);
        avatarUrl = uploadResponse.url;
      }

      const finalPayload = { ...formData, avatar: avatarUrl };

      if (editingAdmin) {
        await adminService.updateAdmin(editingAdmin.id, finalPayload);
        Swal.fire('Sukses!', 'User berhasil diperbarui.', 'success');
      } else {
        await adminService.createAdmin(finalPayload);
        Swal.fire('Sukses!', 'User berhasil ditambahkan.', 'success');
      }

      await loadAdmins();
      setShowModal(false);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Pastikan semua kolom terisi.';
      Swal.fire('Error', `Gagal menyimpan data: ${errorMessage}`, 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteClick = (id: number) => {
    Swal.fire({
      title: 'Apakah Anda yakin?',
      text: 'Data ini tidak akan bisa dikembalikan!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonText: 'Batal',
      confirmButtonText: 'Ya, hapus!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await adminService.deleteAdmin(id);
          await loadAdmins();
          Swal.fire('Terhapus!', 'User berhasil dihapus.', 'success');
        } catch (err) {
          Swal.fire('Error', 'Gagal menghapus user.', 'error');
        }
      }
    });
  };

  const handleToggleStatusClick = (id: number, currentStatus: 'active' | 'inactive') => {
    const actionText = currentStatus === 'active' ? 'nonaktifkan' : 'aktifkan';
    Swal.fire({
      title: `Anda yakin ingin ${actionText} user ini?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: `Ya, ${actionText}!`,
      cancelButtonText: 'Batal',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await adminService.toggleAdminStatus(id);
          await loadAdmins();
          Swal.fire('Sukses!', 'Status user berhasil diubah.', 'success');
        } catch (err) {
          Swal.fire('Error', 'Gagal mengubah status user.', 'error');
        }
      }
    });
  };

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Kelola Admin & Operator</h1>
            <p className="text-gray-600">Total {admins.length} user terdaftar.</p>
          </div>
          <button
            onClick={() => openModal(null)}
            disabled={!currentUserIsAdmin}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <Plus size={18} /> Tambah User
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="p-4 text-left text-xs font-medium uppercase">User</th>
                  <th className="p-4 text-left text-xs font-medium uppercase">Role</th>
                  <th className="p-4 text-left text-xs font-medium uppercase">Status</th>
                  <th className="p-4 text-left text-xs font-medium uppercase">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {admins.map((admin) => {
                  const isSelf = authState.user?.id === admin.id;
                  return (
                    <tr key={admin.id} className="hover:bg-gray-50">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {admin.avatar ? (
                            <img
                              src={`${API_HOST}${admin.avatar}`}
                              alt={admin.name}
                              className="w-10 h-10 rounded-full object-cover bg-gray-200"
                            />
                          ) : (
                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                              {admin.role === 'admin' ? (
                                <Shield className="text-purple-600" />
                              ) : (
                                <User className="text-blue-600" />
                              )}
                            </div>
                          )}
                          <div>
                            <div className="font-medium">{admin.name}</div>
                            <div className="text-sm text-gray-500">{admin.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <RoleBadge role={admin.role} />
                      </td>
                      <td className="p-4">
                        <StatusBadge status={admin.status} />
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => openModal(admin)}
                            disabled={!currentUserIsAdmin}
                            className="p-1 text-yellow-500 hover:text-yellow-700 disabled:text-gray-400 disabled:cursor-not-allowed"
                            title="Edit"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(admin.id)}
                            disabled={!currentUserIsAdmin || isSelf}
                            className="p-1 text-red-500 hover:text-red-700 disabled:text-gray-400 disabled:cursor-not-allowed"
                            title="Hapus"
                          >
                            <Trash2 size={18} />
                          </button>
                          <button
                            onClick={() => handleToggleStatusClick(admin.id, admin.status)}
                            disabled={!currentUserIsAdmin || isSelf}
                            className={`p-1 ${
                              admin.status === 'active'
                                ? 'text-gray-500 hover:text-gray-700'
                                : 'text-green-500 hover:text-green-700'
                            } disabled:text-gray-400 disabled:cursor-not-allowed`}
                            title={admin.status === 'active' ? 'Nonaktifkan' : 'Aktifkan'}
                          >
                            {admin.status === 'active' ? (
                              <PowerOff size={18} />
                            ) : (
                              <Power size={18} />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h2 className="text-lg font-semibold mb-6">
                {editingAdmin ? 'Edit User' : 'Tambah User Baru'}
              </h2>
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="flex flex-col items-center gap-4">
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Avatar preview"
                      className="w-24 h-24 rounded-full object-cover bg-gray-200"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                      <User className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                  <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm flex items-center gap-2">
                    <UploadCloud size={16} />
                    Ganti Gambar
                    <input
                      type="file"
                      className="hidden"
                      accept="image/png, image/jpeg, image/gif"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>
                <input
                  placeholder="Nama"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border p-2 rounded"
                  required
                />
                <input
                  placeholder="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full border p-2 rounded"
                  required
                />
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value as 'admin' | 'operator' })
                  }
                  className="w-full border p-2 rounded"
                  required
                >
                  <option value="operator">Operator</option>
                  <option value="admin">Admin</option>
                </select>
                <input
                  type="password"
                  placeholder={editingAdmin ? 'Kosongkan jika tidak diubah' : 'Password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full border p-2 rounded"
                  required={!editingAdmin}
                />
                <div className="mt-6 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="bg-gray-200 px-4 py-2 rounded-lg"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isUploading || !currentUserIsAdmin}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg disabled:bg-blue-300"
                  >
                    {isUploading
                      ? 'Menyimpan...'
                      : editingAdmin
                      ? 'Simpan Perubahan'
                      : 'Tambah User'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminManagement;

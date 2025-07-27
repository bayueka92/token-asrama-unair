import React, { useState, useEffect, useCallback } from 'react';
import { Save, Settings, Loader, AlertCircle, CheckCircle, Trash2 } from 'lucide-react';
import apiClient from '../../services/apiClient';
import axios from 'axios';

interface MasterData {
  id: number;
  harga_per_kwh: number;
  biaya_admin_persen: number;
}

const MASTER_DATA_ENDPOINT = '/master-data';

const MasterDataManagement: React.FC = () => {
  const [masterData, setMasterData] = useState<MasterData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    harga_per_kwh: '',
    biaya_admin_persen: '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

const fetchMasterData = useCallback(async () => {
  setIsLoading(true);
  setError(null);
  try {
    const response = await apiClient.get(MASTER_DATA_ENDPOINT);
      const data: MasterData[] = response.data.data;
      const sortedData = [...data].sort((a, b) => b.id - a.id);
      const currentMasterData = sortedData.length > 0 ? sortedData[0] : null;

      if (currentMasterData && currentMasterData.id) {
        setMasterData(currentMasterData);
        setFormData({
          harga_per_kwh: currentMasterData.harga_per_kwh.toString(),
          biaya_admin_persen: currentMasterData.biaya_admin_persen.toString(),
        });
      } else {
        setMasterData(null);
        setFormData({ harga_per_kwh: '', biaya_admin_persen: '' });
      }
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status === 401) {
      setError('Akses ditolak. Sesi Anda mungkin telah berakhir.');
    } else {
      setError('Gagal mengambil data dari server. Silakan coba lagi.');
    }
  } finally {
    setIsLoading(false);
  }
}, []);

useEffect(() => {
  fetchMasterData();
}, [fetchMasterData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);

    const hargaPerKwhString = formData.harga_per_kwh.replace(',', '.');
    const biayaAdminPersenString = formData.biaya_admin_persen.replace(',', '.');

    const parsedHargaPerKwh = parseFloat(hargaPerKwhString);
    const parsedBiayaAdminPersen = parseFloat(biayaAdminPersenString);

    if (isNaN(parsedHargaPerKwh) || isNaN(parsedBiayaAdminPersen)) {
      setError('Harga per kWh dan Biaya Admin harus berupa angka valid.');
      setIsSaving(false);
      return;
    }

    const dataToSave = {
      harga_per_kwh: parsedHargaPerKwh,
      biaya_admin_persen: parsedBiayaAdminPersen,
    };

    try {
      let response;
      if (masterData && typeof masterData.id === 'number' && masterData.id > 0) {
        console.log(`Mengirim PUT request ke: ${MASTER_DATA_ENDPOINT}/${masterData.id} dengan data:`, dataToSave);
        response = await apiClient.put(`${MASTER_DATA_ENDPOINT}/${masterData.id}`, dataToSave);
      } else {
        console.log('Mengirim POST request dengan data:', dataToSave);
        response = await apiClient.post(MASTER_DATA_ENDPOINT, dataToSave);
      }

      const savedData = response.data.data as MasterData;
      setMasterData(savedData);
      setSuccessMessage(`Data master berhasil ${masterData ? 'diperbarui' : 'dibuat'}!`);
      setFormData({
        harga_per_kwh: savedData.harga_per_kwh.toString(),
        biaya_admin_persen: savedData.biaya_admin_persen.toString(),
      });
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Gagal menyimpan data. Silakan coba lagi.');
      }
    } finally {
      setIsSaving(false);
      setTimeout(() => setSuccessMessage(null), 3000);
    }
  };

  const handleDelete = async () => {
    if (!masterData || typeof masterData.id !== 'number' || masterData.id <= 0) {
      setError('Tidak ada data master yang dapat dihapus atau id tidak valid.');
      return;
    }

    if (!window.confirm(`Apakah Anda yakin ingin menghapus data master dengan id ${masterData.id}?`)) return;

    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      console.log(`Mengirim DELETE request ke: ${MASTER_DATA_ENDPOINT}/${masterData.id}`);
      await apiClient.delete(`${MASTER_DATA_ENDPOINT}/${masterData.id}`);
      setSuccessMessage('Data master berhasil dihapus!');
      setMasterData(null);
      setFormData({ harga_per_kwh: '', biaya_admin_persen: '' });
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Gagal menghapus data. Silakan coba lagi.');
      }
    } finally {
      setIsSaving(false);
      setTimeout(() => setSuccessMessage(null), 3000);
    }
  };


  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader className="animate-spin h-8 w-8 text-blue-500" />
        <p className="ml-3 text-gray-600 dark:text-gray-400">Memuat data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center space-x-3">
        <Settings className="h-8 w-8 text-gray-700 dark:text-gray-300" />
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Kelola Data Master</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Atur parameter dasar untuk perhitungan token listrik.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <label htmlFor="harga_per_kwh" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Harga per kWh (Rp)
            </label>
            <input
              type="number"
              id="harga_per_kwh"
              name="harga_per_kwh"
              value={formData.harga_per_kwh}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Contoh: 1445"
              required
              step="any"
            />
          </div>

          <div>
            <label htmlFor="biaya_admin_persen" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Biaya Admin (%)
            </label>
            <div className="relative">
              <input
                type="number"
                id="biaya_admin_persen"
                name="biaya_admin_persen"
                value={formData.biaya_admin_persen}
                onChange={handleInputChange}
                className="w-full pl-3 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Contoh: 0.7"
                step="any"
                required
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">%</span>
              </div>
            </div>
          </div>

          <div className="pt-2">
            {error && (
              <div className="flex items-center text-sm text-red-600 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg mb-4">
                <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {successMessage && (
              <div className="flex items-center text-sm text-green-600 bg-green-50 dark:bg-green-900/20 p-3 rounded-lg mb-4">
                <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                disabled={isSaving}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2.5 rounded-lg flex items-center justify-center space-x-2 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <Loader className="animate-spin h-5 w-5" />
                ) : (
                  <Save className="h-5 w-5" />
                )}
                <span>{isSaving ? 'Menyimpan...' : (masterData ? 'Simpan Perubahan' : 'Buat Data Baru')}</span>
              </button>

              {masterData && masterData.id && (
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isSaving}
                  className="w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white px-4 py-2.5 rounded-lg flex items-center justify-center space-x-2 transition-colors disabled:bg-red-300"
                >
                  <Trash2 className="h-5 w-5" />
                  <span>Hapus</span>
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
        {masterData && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Data Master Saat Ini (Aktif)</h3>
            <p className="text-gray-600 dark:text-gray-400">
                Harga per kWh: {masterData.harga_per_kwh} <br/>
                Biaya Admin: {masterData.biaya_admin_persen}%
            </p>
        </div>
        )}
    </div>
  );
};

export default MasterDataManagement;
import React, { useState } from 'react';
import { Plus, Edit, Trash2, Zap } from 'lucide-react';
import { mockTokenPrices } from '../../data/mockData';
import { TokenPrice } from '../../types';

const TokenManagement: React.FC = () => {
  const [tokens, setTokens] = useState<TokenPrice[]>(mockTokenPrices);
  const [showModal, setShowModal] = useState(false);
  const [editingToken, setEditingToken] = useState<TokenPrice | null>(null);
  const [formData, setFormData] = useState({
    amount: '',
    kwh: '',
  });

  const handleAddToken = () => {
    setEditingToken(null);
    setFormData({ amount: '', kwh: '' });
    setShowModal(true);
  };

  const handleEditToken = (token: TokenPrice) => {
    setEditingToken(token);
    setFormData({
      amount: token.amount.toString(),
      kwh: token.kwh.toString(),
    });
    setShowModal(true);
  };

  const handleSaveToken = () => {
    if (editingToken) {
      setTokens(tokens.map(token => 
        token.id === editingToken.id
          ? { ...token, amount: Number(formData.amount), kwh: Number(formData.kwh), updatedAt: new Date().toISOString() }
          : token
      ));
    } else {
      const newToken: TokenPrice = {
        id: Date.now().toString(),
        amount: Number(formData.amount),
        kwh: Number(formData.kwh),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isActive: true,
      };
      setTokens([...tokens, newToken]);
    }
    setShowModal(false);
  };

  const handleDeleteToken = (id: string) => {
    setTokens(tokens.filter(token => token.id !== id));
  };

  const toggleTokenStatus = (id: string) => {
    setTokens(tokens.map(token => 
      token.id === id
        ? { ...token, isActive: !token.isActive }
        : token
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Kelola Harga Token</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Atur harga token listrik untuk asrama kampus
          </p>
        </div>
        <button
          onClick={handleAddToken}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Tambah Harga Token</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tokens.map((token) => (
          <div key={token.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                    Rp {token.amount.toLocaleString('id-ID')}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {token.kwh} kWh
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEditToken(token)}
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDeleteToken(token.id)}
                  className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Harga per kWh:</span>
                <span className="font-medium text-gray-800 dark:text-white">
                  Rp {Math.round(token.amount / token.kwh).toLocaleString('id-ID')}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Status:</span>
                <span className={`font-medium ${token.isActive ? 'text-green-600' : 'text-red-600'}`}>
                  {token.isActive ? 'Aktif' : 'Nonaktif'}
                </span>
              </div>
            </div>
            
            <button
              onClick={() => toggleTokenStatus(token.id)}
              className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                token.isActive
                  ? 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800'
                  : 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900 dark:text-green-300 dark:hover:bg-green-800'
              }`}
            >
              {token.isActive ? 'Nonaktifkan' : 'Aktifkan'}
            </button>
          </div>
        ))}
      </div>

      {/* Add/Edit Token Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              {editingToken ? 'Edit Harga Token' : 'Tambah Harga Token'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Harga (Rp)
                </label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="200000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  kWh
                </label>
                <input
                  type="number"
                  value={formData.kwh}
                  onChange={(e) => setFormData({ ...formData, kwh: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="120"
                />
              </div>
              {formData.amount && formData.kwh && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Harga per kWh: Rp {Math.round(Number(formData.amount) / Number(formData.kwh)).toLocaleString('id-ID')}
                  </p>
                </div>
              )}
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleSaveToken}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
              >
                {editingToken ? 'Simpan' : 'Tambah'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TokenManagement;
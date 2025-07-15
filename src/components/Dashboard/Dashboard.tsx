import React from 'react';
import { Users, DollarSign, Zap, ShoppingCart } from 'lucide-react';
import StatsCard from './StatsCard';
import LineChart from '../Charts/LineChart';
import BarChart from '../Charts/BarChart';
import { mockDashboardStats } from '../../data/mockData';

const Dashboard: React.FC = () => {
  const stats = mockDashboardStats;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Selamat datang di Admin Panel Token Listrik ASRAMA UNAIR
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total User"
          value={stats.totalUsers.toString()}
          icon={Users}
          color="bg-blue-500"
          change="+12% dari bulan lalu"
        />
        <StatsCard
          title="Total Pembelian"
          value={stats.totalPurchases.toString()}
          icon={ShoppingCart}
          color="bg-green-500"
          change="+8% dari bulan lalu"
        />
        <StatsCard
          title="Total Pendapatan"
          value={`Rp ${stats.totalRevenue.toLocaleString('id-ID')}`}
          icon={DollarSign}
          color="bg-yellow-500"
          change="+15% dari bulan lalu"
        />
        <StatsCard
          title="Total KWH"
          value={`${stats.totalKwh.toLocaleString('id-ID')} kWh`}
          icon={Zap}
          color="bg-purple-500"
          change="+10% dari bulan lalu"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Grafik Pembelian Bulanan
          </h3>
          <LineChart data={stats.monthlyData} type="purchases" />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Grafik Pendapatan Bulanan
          </h3>
          <LineChart data={stats.monthlyData} type="revenue" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Pembelian Harian (7 Hari Terakhir)
          </h3>
          <BarChart data={stats.dailyData} type="purchases" />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Pendapatan Harian (7 Hari Terakhir)
          </h3>
          <BarChart data={stats.dailyData} type="revenue" />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
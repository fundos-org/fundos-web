import AdminOverviewTable from '@/components/custom/AdminSection/AdminOverviewTable';
import StatisticCardList from '@/components/custom/StatisticCardList';
import { useAdminDashboardStats } from '@/hooks/customhooks/AdminHooks/useAdminDashboardStats';

function AdminDashboard() {
  const { data } = useAdminDashboardStats();
  const { success, ...rest } = data ?? {};
  void success;
  const stats = rest;
  return (
    <>
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-4xl">Dashboard</h2>
        </div>
      </header>
      <div className="mb-8">
        <small className="text-gray-500">Track whom you are onboarding</small>
      </div>
      <StatisticCardList stats={stats} />
      <AdminOverviewTable />
    </>
  );
}

export default AdminDashboard;

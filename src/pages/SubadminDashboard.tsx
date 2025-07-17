import { useAppStateEffect } from '@/app/hooks';
import { RootState } from '@/app/store';
import { fetchDashboardStatistics } from '@/axioscalls/apiServices';
import StatisticCardList from '@/components/custom/StatisticCardList';
import TransactionTable from '@/components/custom/tables/TransactionDetailsTable';
import { useState } from 'react';

const SubadminDashboard = () => {
  const stats = useAppStateEffect(
    (state: RootState) => state.dashboard.statistics,
    fetchDashboardStatistics
  );
  const [name] = useState(
    JSON.parse(sessionStorage.getItem('subadmindetails') || '{}').name || ''
  );
  if (!name) {
    return <div>Please log in</div>;
  }

  return (
    <>
      <h2 className="text-4xl">Welcome Back, {name}</h2>
      <div className="mb-8">
        <small className="text-gray-500">
          Measure your advertising ROI and report website traffic
        </small>
      </div>
      <StatisticCardList
        stats={stats as Record<string, string | number> | undefined}
      />
      <div className="w-full flex gap-5 mb-5">
        {/* <OverViewChart /> */}
        {/* <ActivitesList /> */}
      </div>
      <TransactionTable header="Recent" transactions={[]} />
    </>
  );
};

export default SubadminDashboard;

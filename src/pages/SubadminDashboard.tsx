import StatisticCardList from '@/components/custom/StatisticCardList';
import TransactionTable from '@/components/custom/tables/TransactionDetailsTable';
import { useSubadminDashboardMetadata } from '@/hooks/customhooks/SubAdminsHooks/useSubadminDashboardMetadata';
import { useState } from 'react';

const SubadminDashboard = () => {
  const { data: stats } = useSubadminDashboardMetadata();
  const [name] = useState(
    JSON.parse(sessionStorage.getItem('subadmindetails') || '{}').name || ''
  );

  const { subadmin_id, subadmin_name, success, ...rest } = stats || {};
  void subadmin_id;
  void success;
  void subadmin_name;

  return (
    <>
      <h2 className="text-4xl">Welcome Back, {name}</h2>
      <div className="mb-8">
        <small className="text-gray-500">
          Measure your advertising ROI and report website traffic
        </small>
      </div>
      <StatisticCardList
        stats={rest as Record<string, string | number> | undefined}
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

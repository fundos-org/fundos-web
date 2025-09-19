import StatisticCardList from '@/components/custom/StatisticCardList';
import TransactionTable from '@/components/custom/tables/TransactionDetailsTable';
import { useSubadminDashboardMetadata } from '@/hooks/customhooks/SubAdminsHooks/useSubadminDashboardMetadata';
import { useSubadminTransactions } from '@/hooks/customhooks/SubAdminsHooks/useSubadminTransactions';
import { useState } from 'react';

const SubadminDashboard = () => {
  const { data: stats } = useSubadminDashboardMetadata();
  const { data: transactionsData } = useSubadminTransactions(1, 10);
  const [name] = useState(
    JSON.parse(sessionStorage.getItem('subadmindetails') || '{}').name || ''
  );

  const { subadmin_id, subadmin_name, success, ...rest } = stats || {};
  void subadmin_id;
  void success;
  void subadmin_name;

  // Transform API data to match the transaction table interface
  const transactions = transactionsData?.data?.map(transaction => ({
    transaction_id: transaction.transaction_id,
    investor: transaction.investor_name,
    invested_in: transaction.deal_name,
    amount: transaction.amount,
    transaction_date: transaction.transaction_date,
  })) || [];

  return (
    <>
      <h2 className="fundos-dashboard-title text-gray-900">Welcome Back, {name}</h2>
      <div className="mb-8">
        <small className="fundos-dashboard-subtitle">
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
      <TransactionTable header="Recent" transactions={transactions} />
    </>
  );
};

export default SubadminDashboard;

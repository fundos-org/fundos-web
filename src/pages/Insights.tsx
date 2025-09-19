import SubadminTimeAnalyticsChart from '@/components/custom/SubadminTimeAnalyticsChart';
import DealsAnalyticsChart from '@/components/custom/DealsAnalyticsChart';
import AllTransactionsTable from '@/components/custom/AllTransactionsTable';
import TransactionSummaryTable from '@/components/custom/TransactionSummaryTable';

export default function Insights() {
  return (
    <>
      <header className="flex justify-between items-center mb-2">
        <div>
          <h1 className="fundos-dashboard-title">Insights</h1>
          <p className="fundos-dashboard-subtitle">Comprehensive analytics and insights dashboard</p>
        </div>
      </header>

      {/* Analytics Section - Full Width Vertical */}
      <div className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Analytics</h3>
        <div className="w-full space-y-8">
          <div className="w-full">
            <SubadminTimeAnalyticsChart />
          </div>
          <div className="w-full">
            <DealsAnalyticsChart />
          </div>
        </div>
      </div>

      {/* Transaction Tables Section */}
      <div className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Transaction Details</h3>
        <div className="w-full space-y-8">
          <div className="w-full">
            <AllTransactionsTable />
          </div>
          <div className="w-full">
            <TransactionSummaryTable />
          </div>
        </div>
      </div>
    </>
  );
}

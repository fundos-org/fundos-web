import SubadminTimeAnalyticsChart from '@/components/custom/SubadminTimeAnalyticsChart';
import DealsAnalyticsChart from '@/components/custom/DealsAnalyticsChart';
import AllTransactionsTable from '@/components/custom/AllTransactionsTable';
import TransactionSummaryTable from '@/components/custom/TransactionSummaryTable';

export default function Insights() {
  return (
    <>
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-4xl">Insights</h2>
        </div>
      </header>
      <div className="mb-8">
        <small className="text-gray-500">
          Comprehensive analytics and insights dashboard
        </small>
      </div>

      {/* Analytics Section - Full Width Vertical */}
      <div className="mb-10">
        <h3 className="text-2xl text-white mb-6">Analytics</h3>
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
        <h3 className="text-2xl text-white mb-6">Transaction Details</h3>
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

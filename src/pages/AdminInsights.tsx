import TimeMetricsChart from '@/components/custom/TimeMetricsChart';
import SubadminMetricsChart from '@/components/custom/SubadminMetricsChart';

export default function AdminInsights() {
  return (
    <>
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-4xl">Admin Insights</h2>
        </div>
      </header>
      <div className="mb-8">
        <small className="text-gray-500">
          Comprehensive analytics and insights for administrative oversight
        </small>
      </div>

      {/* Metrics Analytics Section - Full Width Vertical */}
      <div className="mb-10">
        <h3 className="text-2xl text-white mb-6">Metrics Analytics</h3>
        <div className="w-full space-y-8">
          <div className="w-full">
            <TimeMetricsChart />
          </div>
          <div className="w-full">
            <SubadminMetricsChart />
          </div>
        </div>
      </div>
    </>
  );
}

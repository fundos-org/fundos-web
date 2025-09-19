import TimeMetricsChart from '@/components/custom/TimeMetricsChart';
import SubadminMetricsChart from '@/components/custom/SubadminMetricsChart';

export default function AdminInsights() {
  return (
    <>
      <header className="flex justify-between items-center mb-2">
        <div>
          <h1 className="fundos-dashboard-title text-gray-900">Admin Insights</h1>
          <p className="fundos-dashboard-subtitle">
            Comprehensive analytics and insights for administrative oversight
          </p>
        </div>
      </header>

      {/* Analytics Section - Full Width Vertical */}
      <div className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Analytics</h3>
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

import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartTooltip,
} from '@/components/ui/chart';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import ChartControls from './ChartControls';
import { exportToCSV, exportToExcel, exportToPDF, formatChartDataForExport } from '@/utils/exportUtils';
import { analyticsApi, SubadminMetricsParams } from '@/axioscalls/analyticsApi';
import { useState, useMemo, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { useNotification } from './NotificationProvider';

interface ChartDataItem {
  subadmin: string;
  value: number;
  date: string;
}


type MetricType = 'TOTAL_USERS' | 'DEALS' | 'ONBOARDING_STATUS' | 'KYC_STATUS' | 'TRANSACTIONS' | 'PAYMENT_STATUS';

const metricLabels = {
  TOTAL_USERS: 'Total Users',
  DEALS: 'Deals',
  ONBOARDING_STATUS: 'Onboarding Status',
  KYC_STATUS: 'KYC Status',
  TRANSACTIONS: 'Transactions',
  PAYMENT_STATUS: 'Payment Status',
};

export default function SubadminMetricsChart() {
  const [selectedMetric, setSelectedMetric] = useState<MetricType>('TOTAL_USERS');
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({ start: '', end: '' });
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const notification = useNotification();

  // Fetch data from API
  const fetchMetricsData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params: SubadminMetricsParams = {
        metric_type: selectedMetric,
        ...(dateRange.start && { start_date: new Date(dateRange.start).toISOString() }),
        ...(dateRange.end && { end_date: new Date(dateRange.end).toISOString() }),
      };

      const response = await analyticsApi.getSubadminMetrics(params);
      
      // Transform API response to match chart format
      const transformedData: ChartDataItem[] = response.data.map(item => ({
        subadmin: item.subadmin_name,
        value: item.value,
        date: item.date,
      }));
      
      setChartData(transformedData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch subadmin metrics data';
      setError(errorMessage);
      notification.error('Error Loading Data', `Error loading ${metricLabels[selectedMetric]}: ${errorMessage}`);
      setChartData([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when component mounts or metric changes
  useEffect(() => {
    fetchMetricsData();
  }, [selectedMetric]);

  // Apply client-side date filtering (if needed for real-time filtering)
  const filteredData = useMemo(() => {
    if (!dateRange.start || !dateRange.end) return chartData;
    
    return chartData.filter(item => {
      const itemDate = new Date(item.date);
      const startDate = new Date(dateRange.start);
      const endDate = new Date(dateRange.end);
      return itemDate >= startDate && itemDate <= endDate;
    });
  }, [chartData, dateRange]);

  const handleDateRangeChange = (startDate: string, endDate: string) => {
    setDateRange({ start: startDate, end: endDate });
    // Optionally, you can refetch data here for server-side filtering
    // fetchMetricsData();
  };

  const handleExport = (format: 'csv' | 'pdf' | 'excel') => {
    const exportData = formatChartDataForExport(filteredData, `Subadmin-based ${metricLabels[selectedMetric]}`);
    
    switch (format) {
      case 'csv':
        exportToCSV(exportData, `subadmin-metrics-${selectedMetric}`);
        break;
      case 'excel':
        exportToExcel(exportData, `subadmin-metrics-${selectedMetric}`);
        break;
      case 'pdf':
        exportToPDF('subadmin-metrics-chart', `subadmin-metrics-${selectedMetric}`);
        break;
    }
  };


  return (
    <Card className="w-full bg-white border border-gray-200 rounded-lg shadow-sm" id="subadmin-metrics-chart">
      <CardHeader className="border-b border-gray-200 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-semibold text-gray-900">Sub Admin Metrics</CardTitle>
            <CardDescription className="text-gray-600">
              {metricLabels[selectedMetric]} analysis by sub admin
            </CardDescription>
          </div>
          <div className="flex items-center gap-4">
            <Select value={selectedMetric} onValueChange={(value: MetricType) => setSelectedMetric(value)}>
              <SelectTrigger className="w-48 bg-gray-50 border border-gray-200 text-gray-900 rounded-lg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 rounded-lg shadow-lg">
                {Object.entries(metricLabels).map(([key, label]) => (
                  <SelectItem key={key} value={key} className="text-gray-900 hover:bg-gray-50 cursor-pointer">
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <ChartControls
              showDateFilter={true}
              showExport={true}
              showQuickDateButtons={true}
              onDateRangeChange={handleDateRangeChange}
              onExport={handleExport}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Loading Overlay */}
          {loading && (
            <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-10 rounded-md">
              <div className="flex items-center gap-3 text-gray-600">
                <RefreshCw className="h-5 w-5 animate-spin" />
                <span className="text-sm font-medium">Loading metrics data...</span>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="flex items-center justify-center h-[250px] text-gray-600 flex-col gap-2">
              <p>Error loading data: {error}</p>
              <button 
                onClick={fetchMetricsData}
                className="text-blue-600 hover:text-blue-800 underline text-sm"
              >
                Try again
              </button>
            </div>
          )}

          {/* Chart Content */}
          {!error && (
            <>
              {filteredData.length === 0 && !loading ? (
                <div className="flex items-center justify-center h-[250px] text-gray-600">
                  No data available for the selected period
                </div>
              ) : (
                <div className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={filteredData}
                      margin={{
                        top: 10,
                        right: 10,
                        left: 10,
                        bottom: 40,
                      }}
                      barCategoryGap={5}
                      maxBarSize={80}
                    >
                    <XAxis
                      dataKey="subadmin"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      className="text-gray-600"
                      angle={-45}
                      textAnchor="end"
                      height={40}
                      fontSize={12}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      className="text-gray-600"
                    />
                    <ChartTooltip
                      cursor={false}
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-lg">
                              <p className="text-gray-600 text-sm font-medium">Sub Admin: {data.subadmin}</p>
                              <p className="text-gray-900 text-sm">
                                <span className="text-gray-600">{metricLabels[selectedMetric]}: </span>
                                <span className="font-semibold">{Math.round(Number(data.value))}</span>
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar
                      dataKey="value"
                      fill="#3b82f6"
                      radius={[4, 4, 0, 0]}
                      fillOpacity={0.8}
                      minPointSize={2}
                    />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

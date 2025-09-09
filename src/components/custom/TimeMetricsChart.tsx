import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts';
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
import { analyticsApi, TimeMetricsParams } from '@/axioscalls/analyticsApi';
import { useState, useMemo, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

interface ChartDataItem {
  time: string;
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

export default function TimeMetricsChart() {
  const [selectedMetric, setSelectedMetric] = useState<MetricType>('TOTAL_USERS');
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({ start: '', end: '' });
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch data from API
  const fetchMetricsData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params: TimeMetricsParams = {
        metric_type: selectedMetric,
        time_period: 'MONTHLY',
        ...(dateRange.start && { start_date: new Date(dateRange.start).toISOString() }),
        ...(dateRange.end && { end_date: new Date(dateRange.end).toISOString() }),
      };

      const response = await analyticsApi.getTimeMetrics(params);
      
      // Transform API response to match chart format
      const transformedData: ChartDataItem[] = response.data.map(item => ({
        time: item.time_period,
        value: item.value,
        date: item.date,
      }));
      
      setChartData(transformedData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch metrics data';
      setError(errorMessage);
      toast.error(`Error loading ${metricLabels[selectedMetric]}: ${errorMessage}`);
      setChartData([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when component mounts or metric/date range changes
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
    const exportData = formatChartDataForExport(filteredData, `Time-based ${metricLabels[selectedMetric]}`);
    
    switch (format) {
      case 'csv':
        exportToCSV(exportData, `time-metrics-${selectedMetric}`);
        break;
      case 'excel':
        exportToExcel(exportData, `time-metrics-${selectedMetric}`);
        break;
      case 'pdf':
        exportToPDF('time-metrics-chart', `time-metrics-${selectedMetric}`);
        break;
    }
  };


  return (
    <Card className="w-full border-0 rounded-none bg-[#1f1f1f] text-white" id="time-metrics-chart">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl text-gray-400">TIME-BASED METRICS</CardTitle>
            <CardDescription className="text-gray-500">
              {metricLabels[selectedMetric]} analysis over time
            </CardDescription>
          </div>
          <div className="flex items-center gap-4">
            <Select value={selectedMetric} onValueChange={(value: MetricType) => setSelectedMetric(value)}>
              <SelectTrigger className="w-40 bg-[#2A2A2B] border-gray-600 text-white rounded-none">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#1f1f1f] border-gray-600 rounded-none">
                {Object.entries(metricLabels).map(([key, label]) => (
                  <SelectItem key={key} value={key} className="text-white hover:bg-[#2A2A2B]">
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
            <div className="absolute inset-0 bg-[#1f1f1f] bg-opacity-80 flex items-center justify-center z-10 rounded-md">
              <div className="flex items-center gap-3 text-gray-300">
                <RefreshCw className="h-5 w-5 animate-spin" />
                <span className="text-sm font-medium">Loading time metrics data...</span>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="flex items-center justify-center h-[250px] text-gray-400 flex-col gap-2">
              <p className="text-red-400 mb-2">Error loading data: {error}</p>
              <button 
                onClick={fetchMetricsData}
                className="text-blue-400 hover:text-blue-300 underline text-sm"
              >
                Try again
              </button>
            </div>
          )}

          {/* Chart Content */}
          {!error && (
            <>
              {filteredData.length === 0 && !loading ? (
                <div className="flex items-center justify-center h-[250px] text-gray-400">
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
                    <CartesianGrid 
                      vertical={false} 
                      stroke="hsl(var(--border))" 
                      opacity={0.3}
                    />
                    <XAxis
                      dataKey="time"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      className="text-gray-400"
                      angle={-45}
                      textAnchor="end"
                      height={40}
                      fontSize={12}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      className="text-gray-400"
                    />
                    <ChartTooltip
                      cursor={false}
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-[#2A2A2B] border border-gray-600 rounded-md p-3 shadow-lg">
                              <p className="text-gray-300 text-sm font-medium">Time: {data.time}</p>
                              <p className="text-white text-sm">
                                <span className="text-gray-400">{metricLabels[selectedMetric]}: </span>
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
                      fill="hsl(var(--chart-1))"
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

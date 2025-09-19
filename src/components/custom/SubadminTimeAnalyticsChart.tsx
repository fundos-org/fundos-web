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
import { analyticsApi, TimeSeriesParams } from '@/axioscalls/analyticsApi';
import { useState, useMemo, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { useNotification } from './NotificationProvider';

interface ChartDataItem {
  time: string;
  value: number;
  date: string;
}

type MetricType = 'ONBOARDED_INVESTORS' | 'TRANSACTIONS' | 'KYC_COMPLETED' | 'INVESTOR_TYPES';

const metricLabels = {
  ONBOARDED_INVESTORS: 'Onboarded Investors',
  TRANSACTIONS: 'Transactions',
  KYC_COMPLETED: 'KYC Completed',
  INVESTOR_TYPES: 'Investor Types',
};

export default function SubadminTimeAnalyticsChart() {
  const [data, setData] = useState<ChartDataItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedMetric, setSelectedMetric] = useState<MetricType>('ONBOARDED_INVESTORS');
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({ start: '', end: '' });
  
  const notification = useNotification();

  const fetchMetricsData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params: TimeSeriesParams = {
        metric_type: selectedMetric,
        ...(dateRange.start && { start_date: dateRange.start }),
        ...(dateRange.end && { end_date: dateRange.end }),
      };

      // Use the new optimized time-series API
      const response = await analyticsApi.getTimeSeriesData(params);

      // Transform the API response to chart format
      const transformedData: ChartDataItem[] = response.data?.map((item) => ({
        time: item.time_period, // Already in "YYYY-MM" format from API
        value: item.value,
        date: item.date,
      })) || [];

      setData(transformedData);
    } catch (error) {
      console.error('Error fetching time-series data:', error);
      setError('Failed to load time-series data');
      notification.error('Error Loading Data', 'Failed to load time-series data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetricsData();
  }, [selectedMetric, dateRange]);

  const filteredData = useMemo(() => {
    if (!dateRange.start && !dateRange.end) return data;
    
    return data.filter(item => {
      const itemDate = new Date(item.date);
      const startDate = dateRange.start ? new Date(dateRange.start) : null;
      const endDate = dateRange.end ? new Date(dateRange.end) : null;
      
      if (startDate && itemDate < startDate) return false;
      if (endDate && itemDate > endDate) return false;
      
      return true;
    });
  }, [data, dateRange]);

  const handleDateRangeChange = (startDate: string, endDate: string) => {
    setDateRange({ start: startDate, end: endDate });
  };

  const handleExport = (format: 'csv' | 'pdf' | 'excel') => {
    const exportData = formatChartDataForExport(
      filteredData.map(item => ({
        Time: item.time,
        [metricLabels[selectedMetric]]: item.value,
      })),
      `Subadmin Time ${metricLabels[selectedMetric]} Report`
    );
    
    switch (format) {
      case 'csv':
        exportToCSV(exportData, `subadmin-time-${selectedMetric.toLowerCase()}-report`);
        break;
      case 'excel':
        exportToExcel(exportData, `subadmin-time-${selectedMetric.toLowerCase()}-report`);
        break;
      case 'pdf':
        exportToPDF('subadmin-time-analytics-chart', `subadmin-time-${selectedMetric.toLowerCase()}-report`);
        break;
    }
  };


  return (
    <Card className="w-full bg-white border border-gray-200 rounded-lg shadow-sm" id="subadmin-time-analytics-chart">
      <CardHeader className="border-b border-gray-200 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-semibold text-gray-900">Time-Based Analytics</CardTitle>
            <CardDescription className="text-gray-600">
              {metricLabels[selectedMetric]} analysis over time
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
                      dataKey="time"
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
                              <p className="text-gray-600 text-sm font-medium">Time: {data.time}</p>
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

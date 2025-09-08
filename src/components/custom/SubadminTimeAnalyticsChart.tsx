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
import { analyticsApi, BaseAnalyticsParams } from '@/axioscalls/analyticsApi';
import { useState, useMemo, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

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

  const fetchMetricsData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      let response;
      const params: BaseAnalyticsParams = {
        ...(dateRange.start && { start_date: dateRange.start }),
        ...(dateRange.end && { end_date: dateRange.end }),
      };

      // For now, we'll use existing APIs and map them to the time-based format
      // This will need to be updated when the backend provides time-series APIs
      switch (selectedMetric) {
        case 'ONBOARDED_INVESTORS':
          response = await analyticsApi.getOnboardedInvestors(params);
          break;
        case 'TRANSACTIONS':
          response = await analyticsApi.getTransactions(params);
          break;
        case 'KYC_COMPLETED':
          // Placeholder - will use KYC API when available
          response = { data: [] };
          break;
        case 'INVESTOR_TYPES':
          response = await analyticsApi.getInvestorTypes(params);
          break;
        default:
          response = await analyticsApi.getOnboardedInvestors(params);
      }

      // Transform the data to time-based format
      const transformedData: ChartDataItem[] = response.data?.map((item: any, index: number) => ({
        time: item.month || item.type || `Period ${index + 1}`,
        value: item.investors || item.transactions || item.count || 0,
        date: item.date || new Date().toISOString(),
      })) || [];

      setData(transformedData);
    } catch (error) {
      console.error('Error fetching metrics data:', error);
      setError('Failed to load metrics data');
      toast.error('Failed to load metrics data');
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
    <Card className="w-full border-0 rounded-none bg-[#1f1f1f] text-white" id="subadmin-time-analytics-chart">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl text-gray-400">TIME-BASED ANALYTICS</CardTitle>
            <CardDescription className="text-gray-500">
              {metricLabels[selectedMetric]} analysis over time
            </CardDescription>
          </div>
          <div className="flex items-center gap-4">
            <Select value={selectedMetric} onValueChange={(value: MetricType) => setSelectedMetric(value)}>
              <SelectTrigger className="w-48 bg-[#2A2A2B] border-gray-600 text-white rounded-none">
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
                <span className="text-sm font-medium">Loading metrics data...</span>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="flex items-center justify-center h-[250px] text-gray-400 flex-col gap-2">
              <p>Error loading data: {error}</p>
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

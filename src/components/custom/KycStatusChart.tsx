import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
} from '@/components/ui/chart';
import ChartControls from './ChartControls';
import { exportToCSV, exportToExcel, exportToPDF, formatChartDataForExport } from '@/utils/exportUtils';
import { analyticsApi, KycDistributionParams } from '@/axioscalls/analyticsApi';
import { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

const chartConfig = {
  count: {
    label: 'Investor Count',
    color: 'hsl(var(--chart-4))',
  },
} satisfies ChartConfig;

interface KycStatusChartItem {
  status: string;
  count: number;
  percentage?: number;
}

export default function KycStatusChart() {
  const [data, setData] = useState<KycStatusChartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalUsers, setTotalUsers] = useState(0);
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({ start: '', end: '' });

  const fetchKycDistribution = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params: KycDistributionParams = {
        ...(dateRange.start && { start_date: dateRange.start }),
        ...(dateRange.end && { end_date: dateRange.end }),
      };

      const response = await analyticsApi.getKycDistribution(params);
      
      // Transform API response to chart format
      const transformedData: KycStatusChartItem[] = response.data.map((item) => ({
        status: item.status,
        count: item.count,
        percentage: item.percentage,
      }));

      setData(transformedData);
      setTotalUsers(response.total_users);
    } catch (error) {
      console.error('Error fetching KYC distribution:', error);
      setError('Failed to load KYC distribution data');
      toast.error('Failed to load KYC distribution data');
      setData([]);
      setTotalUsers(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKycDistribution();
  }, [dateRange]);

  const handleDateRangeChange = (startDate: string, endDate: string) => {
    setDateRange({ start: startDate, end: endDate });
  };
  const handleExport = (format: 'csv' | 'pdf' | 'excel') => {
    const exportData = formatChartDataForExport(
      data.map(item => ({
        Status: item.status,
        Count: item.count,
        'Percentage (%)': item.percentage?.toFixed(1) || '0.0',
      })),
      'KYC Status Distribution Report'
    );
    
    switch (format) {
      case 'csv':
        exportToCSV(exportData, 'kyc-status-report');
        break;
      case 'excel':
        exportToExcel(exportData, 'kyc-status-report');
        break;
      case 'pdf':
        exportToPDF('kyc-status-chart', 'kyc-status-report');
        break;
    }
  };

  return (
    <Card className="w-full border-0 rounded-none bg-[#1f1f1f] text-white" id="kyc-status-chart">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl text-gray-400">KYC STATUS</CardTitle>
            <CardDescription className="text-gray-500">
              Distribution by verification status {totalUsers > 0 && `(Total: ${totalUsers} users)`}
            </CardDescription>
          </div>
          <ChartControls
            showDateFilter={true}
            showExport={true}
            onDateRangeChange={handleDateRangeChange}
            onExport={handleExport}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Loading Overlay */}
          {loading && (
            <div className="absolute inset-0 bg-[#1f1f1f] bg-opacity-80 flex items-center justify-center z-10 rounded-md">
              <div className="flex items-center gap-3 text-gray-300">
                <RefreshCw className="h-5 w-5 animate-spin" />
                <span className="text-sm font-medium">Loading KYC distribution data...</span>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="flex items-center justify-center h-[250px] text-gray-400 flex-col gap-2">
              <p className="text-red-400 mb-2">Error loading data: {error}</p>
              <button 
                onClick={fetchKycDistribution}
                className="text-blue-400 hover:text-blue-300 underline text-sm"
              >
                Try again
              </button>
            </div>
          )}

          {/* Chart Content */}
          {!error && (
            <>
              {data.length === 0 && !loading ? (
                <div className="flex items-center justify-center h-[250px] text-gray-400">
                  No KYC data available for the selected period
                </div>
              ) : (
                <ChartContainer config={chartConfig} className="h-[250px]">
                  <BarChart
                    accessibilityLayer
                    data={data}
                    margin={{
                      top: 10,
                      right: 12,
                      left: -20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid 
                      vertical={false} 
                      stroke="hsl(var(--border))" 
                      opacity={0.3}
                    />
                    <XAxis
                      dataKey="status"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      className="text-gray-400"
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
                              <p className="text-gray-300 text-sm font-medium">Status: {data.status}</p>
                              <p className="text-white text-sm">
                                <span className="text-gray-400">Count: </span>
                                <span className="font-semibold">{Math.round(Number(data.count))}</span>
                              </p>
                              {data.percentage && (
                                <p className="text-white text-sm">
                                  <span className="text-gray-400">Percentage: </span>
                                  <span className="font-semibold">{data.percentage.toFixed(1)}%</span>
                                </p>
                              )}
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar
                      dataKey="count"
                      fill="var(--color-count)"
                      radius={[4, 4, 0, 0]}
                      fillOpacity={0.8}
                    />
                  </BarChart>
                </ChartContainer>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

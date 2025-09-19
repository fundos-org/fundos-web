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
import { analyticsApi, DealsAnalyticsParams } from '@/axioscalls/analyticsApi';
import { useState, useMemo, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { useNotification } from './NotificationProvider';

interface ChartDataItem {
  deal: string;
  value: string | number;
  date: string;
}


type MetricType = 'INDUSTRY' | 'BUSINESS_MODEL' | 'COMPANY_STAGE' | 'CURRENT_VALUATION' | 'INSTRUMENT_TYPE';

const metricLabels = {
  INDUSTRY: 'Industry',
  BUSINESS_MODEL: 'Business Model',
  COMPANY_STAGE: 'Company Stage',
  CURRENT_VALUATION: 'Current Valuation (₹M)',
  INSTRUMENT_TYPE: 'Instrument Type',
};

export default function DealsAnalyticsChart() {
  const [selectedMetric, setSelectedMetric] = useState<MetricType>('INDUSTRY');
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({ start: '', end: '' });
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const notification = useNotification();

  // Fetch data from API
  const fetchDealsAnalyticsData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params: DealsAnalyticsParams = {
        metric_type: selectedMetric,
        ...(dateRange.start && { start_date: new Date(dateRange.start).toISOString() }),
        ...(dateRange.end && { end_date: new Date(dateRange.end).toISOString() }),
      };

      const response = await analyticsApi.getDealsAnalytics(params);
      
      // Transform API response to match chart format
      const transformedData: ChartDataItem[] = response.data.map(item => ({
        deal: item.deal_name,
        value: item.value,
        date: item.date,
      }));
      
      setChartData(transformedData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch deals analytics data';
      setError(errorMessage);
      notification.error('Error Loading Data', `Error loading ${metricLabels[selectedMetric]}: ${errorMessage}`);
      setChartData([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when component mounts or metric changes
  useEffect(() => {
    fetchDealsAnalyticsData();
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
  };

  const handleExport = (format: 'csv' | 'pdf' | 'excel') => {
    const exportData = formatChartDataForExport(filteredData, `Deals ${metricLabels[selectedMetric]} Analysis`);
    
    switch (format) {
      case 'csv':
        exportToCSV(exportData, `deals-analytics-${selectedMetric}`);
        break;
      case 'excel':
        exportToExcel(exportData, `deals-analytics-${selectedMetric}`);
        break;
      case 'pdf':
        exportToPDF('deals-analytics-chart', `deals-analytics-${selectedMetric}`);
        break;
    }
  };

  // For categorical data, we need to process it differently than numerical data
  const processedData = useMemo(() => {
    if (selectedMetric === 'CURRENT_VALUATION') {
      return filteredData;
    } else {
      // For categorical data, count occurrences of each category
      const categoryCount: { [key: string]: number } = {};
      filteredData.forEach(item => {
        const category = item.value as string;
        categoryCount[category] = (categoryCount[category] || 0) + 1;
      });
      
      return Object.entries(categoryCount).map(([category, count]) => ({
        deal: category,
        value: count,
      }));
    }
  }, [filteredData, selectedMetric]);


  return (
    <Card className="w-full bg-white border border-gray-200 rounded-lg shadow-sm" id="deals-analytics-chart">
      <CardHeader className="border-b border-gray-200 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-semibold text-gray-900">Deals Analytics</CardTitle>
            <CardDescription className="text-gray-600">
              {metricLabels[selectedMetric]} analysis across deals
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
                <span className="text-sm font-medium">Loading deals analytics data...</span>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="flex items-center justify-center h-[280px] text-gray-600 flex-col gap-2">
              <p className="text-red-600 mb-2">Error loading data: {error}</p>
              <button 
                onClick={fetchDealsAnalyticsData}
                className="text-blue-600 hover:text-blue-800 underline text-sm"
              >
                Try again
              </button>
            </div>
          )}

          {/* Chart Content */}
          {!error && (
            <>
              {processedData.length === 0 && !loading ? (
                <div className="flex items-center justify-center h-[280px] text-gray-600">
                  No data available for the selected period
                </div>
              ) : (
                <div className="h-[280px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={processedData}
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
                      dataKey="deal"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      className="text-gray-600"
                      angle={-45}
                      textAnchor="end"
                      height={40}
                      fontSize={10}
                      interval={0}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      className="text-gray-600"
                      tickFormatter={(value) => 
                        selectedMetric === 'CURRENT_VALUATION' ? `₹${value}M` : value.toString()
                      }
                    />
                    <ChartTooltip 
                      cursor={false} 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          const displayValue = selectedMetric === 'CURRENT_VALUATION' 
                            ? `₹${Math.round(Number(data.value))}M` 
                            : Math.round(Number(data.value));
                          const label = selectedMetric === 'CURRENT_VALUATION' ? 'Valuation' : 'Count';
                          
                          return (
                            <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-lg">
                              <p className="text-gray-600 text-sm font-medium">Deal: {data.deal}</p>
                              <p className="text-gray-900 text-sm">
                                <span className="text-gray-600">{label}: </span>
                                <span className="font-semibold">{displayValue}</span>
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

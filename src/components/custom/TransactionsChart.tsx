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
import { analyticsApi, BaseAnalyticsParams } from '@/axioscalls/analyticsApi';
import { useState, useMemo, useEffect } from 'react';
import toast from 'react-hot-toast';

interface ChartDataItem {
  month: string;
  transactions: number;
  date: string;
}

const chartConfig = {
  transactions: {
    label: 'Monthly Transactions',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

export default function TransactionsChart() {
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({ start: '', end: '' });
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch data from API
  const fetchTransactionsData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params: BaseAnalyticsParams = {
        ...(dateRange.start && { start_date: new Date(dateRange.start).toISOString() }),
        ...(dateRange.end && { end_date: new Date(dateRange.end).toISOString() }),
      };

      const response = await analyticsApi.getTransactions(params);
      
      // Transform API response to match chart format
      const transformedData: ChartDataItem[] = response.data.map(item => ({
        month: item.month,
        transactions: item.transactions,
        date: item.date,
      }));
      
      setChartData(transformedData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch transactions data';
      setError(errorMessage);
      toast.error(`Error loading transactions: ${errorMessage}`);
      setChartData([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when component mounts
  useEffect(() => {
    fetchTransactionsData();
  }, []);

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
    // fetchTransactionsData();
  };

  const handleExport = (format: 'csv' | 'pdf' | 'excel') => {
    const exportData = formatChartDataForExport(filteredData, 'Transactions');
    
    switch (format) {
      case 'csv':
        exportToCSV(exportData, 'transactions');
        break;
      case 'excel':
        exportToExcel(exportData, 'transactions');
        break;
      case 'pdf':
        exportToPDF('transactions-chart', 'transactions');
        break;
    }
  };

  // Loading state
  if (loading) {
    return (
      <Card className="w-full border-0 rounded-none bg-[#1f1f1f] text-white" id="transactions-chart">
        <CardContent className="flex items-center justify-center h-[300px]">
          <div className="text-gray-400">Loading transactions data...</div>
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (error) {
    return (
      <Card className="w-full border-0 rounded-none bg-[#1f1f1f] text-white" id="transactions-chart">
        <CardContent className="flex items-center justify-center h-[300px]">
          <div className="text-center">
            <div className="text-red-400 mb-2">Error loading data</div>
            <button 
              onClick={fetchTransactionsData}
              className="text-blue-400 hover:text-blue-300 underline"
            >
              Try again
            </button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full border-0 rounded-none bg-[#1f1f1f] text-white" id="transactions-chart">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl text-gray-400">TRANSACTIONS</CardTitle>
            <CardDescription className="text-gray-500">
              Monthly transaction volume statistics
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
        {filteredData.length === 0 ? (
          <div className="flex items-center justify-center h-[250px] text-gray-400">
            No data available for the selected period
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-[250px]">
            <BarChart
              accessibilityLayer
              data={filteredData}
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
                dataKey="month"
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
                        <p className="text-gray-300 text-sm font-medium">Month: {data.month}</p>
                        <p className="text-white text-sm">
                          <span className="text-gray-400">Transactions: </span>
                          <span className="font-semibold">{Math.round(Number(data.transactions))}</span>
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar
                dataKey="transactions"
                fill="var(--color-transactions)"
                radius={[4, 4, 0, 0]}
                fillOpacity={0.8}
              />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}

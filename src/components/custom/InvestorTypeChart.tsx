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
import { analyticsApi } from '@/axioscalls/analyticsApi';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

interface ChartDataItem {
  type: string;
  count: number;
}

const chartConfig = {
  count: {
    label: 'Investor Count',
    color: 'hsl(var(--chart-3))',
  },
} satisfies ChartConfig;

export default function InvestorTypeChart() {
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch data from API
  const fetchInvestorTypesData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await analyticsApi.getInvestorTypes();
      
      // Transform API response to match chart format
      const transformedData: ChartDataItem[] = response.data.map(item => ({
        type: item.type,
        count: item.count,
      }));
      
      setChartData(transformedData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch investor types data';
      setError(errorMessage);
      toast.error(`Error loading investor types: ${errorMessage}`);
      setChartData([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when component mounts
  useEffect(() => {
    fetchInvestorTypesData();
  }, []);

  const handleExport = (format: 'csv' | 'pdf' | 'excel') => {
    const exportData = formatChartDataForExport(chartData, 'Investor Types');
    
    switch (format) {
      case 'csv':
        exportToCSV(exportData, 'investor-types');
        break;
      case 'excel':
        exportToExcel(exportData, 'investor-types');
        break;
      case 'pdf':
        exportToPDF('investor-types-chart', 'investor-types');
        break;
    }
  };

  // Loading state
  if (loading) {
    return (
      <Card className="w-full border-0 rounded-none bg-[#1f1f1f] text-white" id="investor-types-chart">
        <CardContent className="flex items-center justify-center h-[300px]">
          <div className="text-gray-400">Loading investor types data...</div>
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (error) {
    return (
      <Card className="w-full border-0 rounded-none bg-[#1f1f1f] text-white" id="investor-types-chart">
        <CardContent className="flex items-center justify-center h-[300px]">
          <div className="text-center">
            <div className="text-red-400 mb-2">Error loading data</div>
            <button 
              onClick={fetchInvestorTypesData}
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
    <Card className="w-full border-0 rounded-none bg-[#1f1f1f] text-white" id="investor-types-chart">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl text-gray-400">INVESTOR TYPES</CardTitle>
            <CardDescription className="text-gray-500">
              Distribution by investor category
            </CardDescription>
          </div>
          <ChartControls
            showExport={true}
            onExport={handleExport}
          />
        </div>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <div className="flex items-center justify-center h-[250px] text-gray-400">
            No data available
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-[250px]">
            <BarChart
              accessibilityLayer
              data={chartData}
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
                dataKey="type"
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
                        <p className="text-gray-300 text-sm font-medium">Type: {data.type}</p>
                        <p className="text-white text-sm">
                          <span className="text-gray-400">Count: </span>
                          <span className="font-semibold">{Math.round(Number(data.count))}</span>
                        </p>
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
      </CardContent>
    </Card>
  );
}

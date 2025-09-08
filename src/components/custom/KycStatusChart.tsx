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

// Sample data for KYC status - this would typically come from your API
// In the future, this could be enhanced with a new API endpoint like:
// GET /v1/subadmin/investors/kyc-status-distribution
const chartData = [
  { status: 'Pending', count: 32 },
  { status: 'Completed', count: 41 },
  { status: 'Verified', count: 18 },
];

const chartConfig = {
  count: {
    label: 'Investor Count',
    color: 'hsl(var(--chart-4))',
  },
} satisfies ChartConfig;

interface KycStatusChartProps {
  data?: Array<{ status: string; count: number }>;
}

export default function KycStatusChart({ data = chartData }: KycStatusChartProps) {
  const handleExport = (format: 'csv' | 'pdf' | 'excel') => {
    const exportData = formatChartDataForExport(data, 'KYC Status');
    
    switch (format) {
      case 'csv':
        exportToCSV(exportData, 'kyc-status');
        break;
      case 'excel':
        exportToExcel(exportData, 'kyc-status');
        break;
      case 'pdf':
        exportToPDF('kyc-status-chart', 'kyc-status');
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
              Distribution by verification status
            </CardDescription>
          </div>
          <ChartControls
            showExport={true}
            onExport={handleExport}
          />
        </div>
      </CardHeader>
      <CardContent>
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
      </CardContent>
    </Card>
  );
}

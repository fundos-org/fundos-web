import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import ChartControls from './ChartControls';
import { exportToCSV, exportToExcel, exportToPDF, formatChartDataForExport } from '@/utils/exportUtils';
import { analyticsApi, TransactionSummaryParams } from '@/axioscalls/analyticsApi';
import toast from 'react-hot-toast';

interface TransactionSummaryItem {
  category: 'Total Investments' | 'Pending Transactions' | 'Completed Transactions' | 'On Hold Transactions' | 'Failed Transactions';
  amount: number;
  count: number;
}


export default function TransactionSummaryTable() {
  const [data, setData] = useState<TransactionSummaryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({ start: '', end: '' });
  const [perPage] = useState(10);

  // Fetch data from API
  const fetchTransactionSummary = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params: TransactionSummaryParams = {
        page: currentPage,
        per_page: perPage,
        ...(dateRange.start && { start_date: dateRange.start }),
        ...(dateRange.end && { end_date: dateRange.end }),
      };

      const response = await analyticsApi.getTransactionSummary(params);
      
      setData(response.data);
      setTotalPages(response.total_pages);
      setTotalCount(response.total_count);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch transaction summary data';
      setError(errorMessage);
      toast.error(`Error loading transaction summary: ${errorMessage}`);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when filters change
  useEffect(() => {
    fetchTransactionSummary();
  }, [currentPage, dateRange.start, dateRange.end]);

  const handleDateRangeChange = (startDate: string, endDate: string) => {
    setDateRange({ start: startDate, end: endDate });
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handleExport = (format: 'csv' | 'pdf' | 'excel') => {
    const exportData = formatChartDataForExport(
      data.map(item => ({
        'Category': item.category,
        'Amount': item.amount.toLocaleString('en-IN'),
        'Count': item.count.toString(),
      })),
      'Transaction Summary Report'
    );
    
    switch (format) {
      case 'csv':
        exportToCSV(exportData, 'transaction-summary-report');
        break;
      case 'excel':
        exportToExcel(exportData, 'transaction-summary-report');
        break;
      case 'pdf':
        exportToPDF('transaction-summary-table', 'transaction-summary-report');
        break;
    }
  };


  // Loading state
  if (loading && data.length === 0) {
    return (
      <Card className="w-full border-0 rounded-none bg-[#1f1f1f] text-white" id="transaction-summary-table">
        <CardContent className="flex items-center justify-center h-[400px]">
          <div className="text-gray-400">Loading transaction summary data...</div>
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (error && data.length === 0) {
    return (
      <Card className="w-full border-0 rounded-none bg-[#1f1f1f] text-white" id="transaction-summary-table">
        <CardContent className="flex items-center justify-center h-[400px]">
          <div className="text-center">
            <div className="text-red-400 mb-2">Error loading data</div>
            <button 
              onClick={fetchTransactionSummary}
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
    <Card className="w-full border-0 rounded-none bg-[#1f1f1f] text-white" id="transaction-summary-table">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl text-gray-400">TRANSACTION SUMMARY</CardTitle>
            <CardDescription className="text-gray-500">
              Financial summary by category ({totalCount} categories)
            </CardDescription>
          </div>
          <div className="flex items-center gap-4">
            <ChartControls
              showSearch={false}
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
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-600 hover:bg-[#2A2A2B]">
                <TableHead className="text-gray-400">Category</TableHead>
                <TableHead className="text-gray-400">Amount</TableHead>
                <TableHead className="text-gray-400">Count</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-gray-400 py-8">
                    No transaction summary found for the selected criteria
                  </TableCell>
                </TableRow>
              ) : (
                data.map((item, index) => (
                  <TableRow key={index} className="border-gray-600 hover:bg-[#2A2A2B]">
                    <TableCell className="text-white font-medium">{item.category}</TableCell>
                    <TableCell className="text-white">
                      ₹{item.amount.toLocaleString('en-IN')}
                    </TableCell>
                    <TableCell className="text-white">
                      {item.count}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-gray-400 text-sm">
              Showing {((currentPage - 1) * perPage) + 1} to {Math.min(currentPage * perPage, totalCount)} of {totalCount} entries
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1 || loading}
                className="bg-[#2A2A2B] border-gray-600 text-white hover:bg-[#3A3A3B] rounded-none"
              >
                Previous
              </Button>
              <div className="text-white text-sm">
                Page {currentPage} of {totalPages}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages || loading}
                className="bg-[#2A2A2B] border-gray-600 text-white hover:bg-[#3A3A3B] rounded-none"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
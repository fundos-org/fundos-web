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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ChartControls from './ChartControls';
import { exportToCSV, exportToExcel, exportToPDF, formatChartDataForExport } from '@/utils/exportUtils';
import { analyticsApi, AllTransactionsParams } from '@/axioscalls/analyticsApi';
import { useNotification } from './NotificationProvider';
import { formatEnumToText } from '@/lib/formatUtils';

interface AllTransactionItem {
  payment_status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'ON_HOLD';
  deal_name: string;
  phone_number: string;
  email: string;
  amount: number;
  currency: string;
  transaction_date: string;
  investor_name: string;
  transaction_id: string; // ✅ NEW: For reminder API
  remind_status: string | null; // ✅ NEW: 'REMIND' | 'REMINDED' | null
}

const statusColors = {
  COMPLETED: 'text-green-600',
  PENDING: 'text-yellow-600',
  FAILED: 'text-red-600',
  'ON_HOLD': 'text-orange-600',
};

export default function AllTransactionsTable() {
  const [data, setData] = useState<AllTransactionItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({ start: '', end: '' });
  const [perPage] = useState(10);
  const [remindingItems, setRemindingItems] = useState<Set<string>>(new Set());
  
  const notification = useNotification();

  // Fetch data from API
  const fetchAllTransactions = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params: AllTransactionsParams = {
        page: currentPage,
        per_page: perPage,
        ...(search && { search }),
        ...(statusFilter !== 'all' && { status_filter: statusFilter as any }),
        ...(dateRange.start && { start_date: dateRange.start }),
        ...(dateRange.end && { end_date: dateRange.end }),
      };

      const response = await analyticsApi.getAllTransactions(params);
      
      setData(response.data);
      setTotalPages(response.total_pages);
      setTotalCount(response.total_count);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch all transactions data';
      setError(errorMessage);
      notification.error('Error Loading Data', `Error loading transactions: ${errorMessage}`);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when filters change
  useEffect(() => {
    fetchAllTransactions();
  }, [currentPage, search, statusFilter, dateRange.start, dateRange.end]);

  const handleDateRangeChange = (startDate: string, endDate: string) => {
    setDateRange({ start: startDate, end: endDate });
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handleRemind = async (transactionId: string) => {
    setRemindingItems(prev => new Set(prev).add(transactionId));
    
    try {
      await analyticsApi.sendReminder({ 
        transaction_id: transactionId
      });
      
      // Update the item's remind status in the data
      setData(prevData => 
        prevData.map(item => 
          item.transaction_id === transactionId
            ? { ...item, remind_status: 'REMINDED' }
            : item
        )
      );
      
      notification.success('Reminder Sent', 'Reminder sent successfully!');
    } catch (error) {
      console.error('Failed to send reminder:', error);
      notification.error('Reminder Failed', 'Failed to send reminder. Please try again.');
    } finally {
      setRemindingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(transactionId);
        return newSet;
      });
    }
  };

  const handleExport = (format: 'csv' | 'pdf' | 'excel') => {
    const exportData = formatChartDataForExport(
      data.map(item => ({
        'Investor Name': item.investor_name,
        'Deal Name': item.deal_name,
        'Phone Number': item.phone_number,
        'Email': item.email,
        'Amount': `${item.amount} ${item.currency}`,
        'Payment Status': item.payment_status,
        'Remind Status': item.remind_status || '-',
      })),
      'All Transactions Report'
    );
    
    switch (format) {
      case 'csv':
        exportToCSV(exportData, 'all-transactions-report');
        break;
      case 'excel':
        exportToExcel(exportData, 'all-transactions-report');
        break;
      case 'pdf':
        exportToPDF('all-transactions-table', 'all-transactions-report');
        break;
    }
  };

  const handleSearch = (searchTerm: string) => {
    setSearch(searchTerm);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    setCurrentPage(1); // Reset to first page when filtering
  };

  // Loading state
  if (loading && data.length === 0) {
    return (
      <Card className="w-full bg-white border border-gray-200 rounded-lg shadow-sm" id="all-transactions-table">
        <CardContent className="flex items-center justify-center h-[400px]">
          <div className="text-gray-600">Loading all transactions data...</div>
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (error && data.length === 0) {
    return (
      <Card className="w-full bg-white border border-gray-200 rounded-lg shadow-sm" id="all-transactions-table">
        <CardContent className="flex items-center justify-center h-[400px]">
          <div className="text-center">
            <div className="text-red-600 mb-2">Error loading data</div>
            <button 
              onClick={fetchAllTransactions}
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Try again
            </button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full bg-white border border-gray-200 rounded-lg shadow-sm" id="all-transactions-table">
      <CardHeader className="border-b border-gray-200 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-semibold text-gray-900">All Transactions</CardTitle>
            <CardDescription className="text-gray-600">
              Comprehensive transaction data for all users ({totalCount} total)
            </CardDescription>
          </div>
          <div className="flex items-center gap-4">
            {/* Search Input */}
            <Input
              placeholder="Search by phone, email, or deal..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-64 bg-gray-50 border border-gray-200 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            
            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={handleStatusFilter}>
              <SelectTrigger className="w-40 bg-gray-50 border border-gray-200 text-gray-900 rounded-lg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 rounded-lg shadow-lg">
                <SelectItem value="all" className="text-gray-900 hover:bg-gray-50 cursor-pointer">All Status</SelectItem>
                <SelectItem value="COMPLETED" className="text-gray-900 hover:bg-gray-50 cursor-pointer">Completed</SelectItem>
                <SelectItem value="PENDING" className="text-gray-900 hover:bg-gray-50 cursor-pointer">Pending</SelectItem>
                <SelectItem value="FAILED" className="text-gray-900 hover:bg-gray-50 cursor-pointer">Failed</SelectItem>
                <SelectItem value="ON_HOLD" className="text-gray-900 hover:bg-gray-50 cursor-pointer">On Hold</SelectItem>
              </SelectContent>
            </Select>

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
        <div className="overflow-x-auto custom-scrollbar-table">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-gray-200 hover:bg-gray-50">
                <TableHead className="text-gray-900 font-semibold">Investor Name</TableHead>
                <TableHead className="text-gray-900 font-semibold">Deal Name</TableHead>
                <TableHead className="text-gray-900 font-semibold">Phone Number</TableHead>
                <TableHead className="text-gray-900 font-semibold">Email</TableHead>
                <TableHead className="text-gray-900 font-semibold">Amount</TableHead>
                <TableHead className="text-gray-900 font-semibold">Payment Status</TableHead>
                <TableHead className="text-gray-900 font-semibold">Remind</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-gray-600 py-8">
                    No transactions found for the selected criteria
                  </TableCell>
                </TableRow>
              ) : (
                data.map((transaction) => {
                  const isReminding = remindingItems.has(transaction.transaction_id);
                  const isReminded = transaction.remind_status === 'REMINDED';
                  const canRemind = transaction.remind_status === 'REMIND';
                  
                  return (
                    <TableRow key={transaction.transaction_id} className="border-b border-gray-200 hover:bg-gray-50">
                      <TableCell className="text-gray-900 font-medium">{transaction.investor_name}</TableCell>
                      <TableCell className="text-gray-900">{transaction.deal_name}</TableCell>
                      <TableCell className="text-gray-900">{transaction.phone_number}</TableCell>
                      <TableCell className="text-gray-900">{transaction.email}</TableCell>
                      <TableCell className="text-gray-900">
                        ₹{transaction.amount.toLocaleString('en-IN')}
                      </TableCell>
                      <TableCell className={`font-medium ${statusColors[transaction.payment_status]}`}>
                        {formatEnumToText(transaction.payment_status)}
                      </TableCell>
                      <TableCell>
                        {transaction.remind_status !== null ? (
                          <button
                            onClick={() => handleRemind(transaction.transaction_id)}
                            disabled={!canRemind || isReminding}
                            className={`px-3 py-1 text-xs font-medium rounded-lg border transition-colors ${
                              isReminded 
                                ? 'bg-green-50 border-green-200 text-green-700 cursor-default' 
                                : canRemind 
                                  ? 'bg-yellow-50 border-yellow-200 text-yellow-700 hover:bg-yellow-100 hover:border-yellow-300 cursor-pointer' 
                                  : 'bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed'
                            }`}
                          >
                            {isReminding ? 'Sending...' : isReminded ? 'Reminded' : 'Remind'}
                          </button>
                        ) : (
                          <span className="text-gray-500 text-xs">-</span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
            <div className="text-gray-600 text-sm">
              Showing {((currentPage - 1) * perPage) + 1} to {Math.min(currentPage * perPage, totalCount)} of {totalCount} entries
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1 || loading}
                className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                Previous
              </Button>
              <div className="text-gray-900 text-sm">
                Page {currentPage} of {totalPages}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages || loading}
                className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg"
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

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
import toast from 'react-hot-toast';

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
  COMPLETED: 'text-green-400',
  PENDING: 'text-yellow-400',
  FAILED: 'text-red-400',
  'ON_HOLD': 'text-orange-400',
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
      toast.error(`Error loading transactions: ${errorMessage}`);
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
      
      toast.success('Reminder sent successfully!');
    } catch (error) {
      console.error('Failed to send reminder:', error);
      toast.error('Failed to send reminder. Please try again.');
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
      <Card className="w-full border-0 rounded-none bg-[#1f1f1f] text-white" id="all-transactions-table">
        <CardContent className="flex items-center justify-center h-[400px]">
          <div className="text-gray-400">Loading all transactions data...</div>
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (error && data.length === 0) {
    return (
      <Card className="w-full border-0 rounded-none bg-[#1f1f1f] text-white" id="all-transactions-table">
        <CardContent className="flex items-center justify-center h-[400px]">
          <div className="text-center">
            <div className="text-red-400 mb-2">Error loading data</div>
            <button 
              onClick={fetchAllTransactions}
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
    <Card className="w-full border-0 rounded-none bg-[#1f1f1f] text-white" id="all-transactions-table">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl text-gray-400">ALL TRANSACTIONS</CardTitle>
            <CardDescription className="text-gray-500">
              Comprehensive transaction data for all users ({totalCount} total)
            </CardDescription>
          </div>
          <div className="flex items-center gap-4">
            {/* Search Input */}
            <Input
              placeholder="Search by phone, email, or deal..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-64 bg-[#2A2A2B] border-gray-600 text-white rounded-none"
            />
            
            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={handleStatusFilter}>
              <SelectTrigger className="w-40 bg-[#2A2A2B] border-gray-600 text-white rounded-none">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#1f1f1f] border-gray-600 rounded-none">
                <SelectItem value="all" className="text-white hover:bg-[#2A2A2B]">All Status</SelectItem>
                <SelectItem value="COMPLETED" className="text-white hover:bg-[#2A2A2B]">Completed</SelectItem>
                <SelectItem value="PENDING" className="text-white hover:bg-[#2A2A2B]">Pending</SelectItem>
                <SelectItem value="FAILED" className="text-white hover:bg-[#2A2A2B]">Failed</SelectItem>
                <SelectItem value="ON_HOLD" className="text-white hover:bg-[#2A2A2B]">On Hold</SelectItem>
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
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-600 hover:bg-[#2A2A2B]">
                <TableHead className="text-gray-400">Investor Name</TableHead>
                <TableHead className="text-gray-400">Deal Name</TableHead>
                <TableHead className="text-gray-400">Phone Number</TableHead>
                <TableHead className="text-gray-400">Email</TableHead>
                <TableHead className="text-gray-400">Amount</TableHead>
                <TableHead className="text-gray-400">Payment Status</TableHead>
                <TableHead className="text-gray-400">Remind</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-gray-400 py-8">
                    No transactions found for the selected criteria
                  </TableCell>
                </TableRow>
              ) : (
                data.map((transaction) => {
                  const isReminding = remindingItems.has(transaction.transaction_id);
                  const isReminded = transaction.remind_status === 'REMINDED';
                  const canRemind = transaction.remind_status === 'REMIND';
                  
                  return (
                    <TableRow key={transaction.transaction_id} className="border-gray-600 hover:bg-[#2A2A2B]">
                      <TableCell className="text-white font-medium">{transaction.investor_name}</TableCell>
                      <TableCell className="text-white">{transaction.deal_name}</TableCell>
                      <TableCell className="text-white">{transaction.phone_number}</TableCell>
                      <TableCell className="text-white">{transaction.email}</TableCell>
                      <TableCell className="text-white">
                        {transaction.amount.toLocaleString('en-IN')} {transaction.currency}
                      </TableCell>
                      <TableCell className={`font-medium ${statusColors[transaction.payment_status]}`}>
                        {transaction.payment_status}
                      </TableCell>
                      <TableCell>
                        {transaction.remind_status !== null ? (
                          <button
                            onClick={() => handleRemind(transaction.transaction_id)}
                            disabled={!canRemind || isReminding}
                            className={`px-3 py-1 text-xs font-medium rounded-none border transition-colors ${
                              isReminded 
                                ? 'bg-[#1f1f1f] border-green-600 text-green-400 cursor-default' 
                                : canRemind 
                                  ? 'bg-[#1f1f1f] border-yellow-600 text-yellow-400 hover:bg-[#2A2A2B] hover:border-yellow-500 cursor-pointer' 
                                  : 'bg-[#1f1f1f] border-gray-600 text-gray-500 cursor-not-allowed'
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

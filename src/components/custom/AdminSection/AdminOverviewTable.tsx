import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useAdminOverviewTable } from '@/hooks/customhooks/AdminHooks/useAdminOverviewTable';
import { RefreshCw, Users, Calendar, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';

const pageSizesList = [6, 10, 20, 50];

function AdminOverviewTable() {
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const {
    data,
    isLoading: isFetching,
    error,
    refetch,
  } = useAdminOverviewTable(pageNumber, pageSize);

  if (error) return <div>Error occured please check api</div>;

  const pagination = data?.pagination;

  const handlePrev = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    if (pagination?.has_prev && pageNumber > 1) {
      setPageNumber(prev => prev - 1);
    }
  };

  const handleNext = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    if (pagination?.has_next && pageNumber < (pagination?.total_pages || 1)) {
      setPageNumber(prev => prev + 1);
    }
  };

  const handlePageSizeChange = (value: string) => {
    setPageSize(Number(value));
    setPageNumber(1);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
    } finally {
      setTimeout(() => setIsRefreshing(false), 500); // Small delay for better UX
    }
  };
  // Empty state component
  const EmptyState = () => (
    <Card className="mx-auto mt-8 max-w-md">
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <Users className="h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Subadmins Found</h3>
        <p className="text-gray-600 mb-4">
          There are currently no subadmins in the system. Create a new subadmin to get started.
        </p>
      </CardContent>
    </Card>
  );

  // Error state component  
  const ErrorState = () => (
    <Card className="mx-auto mt-8 max-w-md">
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <AlertCircle className="h-12 w-12 text-red-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Data</h3>
        <p className="text-gray-600 mb-4">
          Unable to load subadmin data. Please check your connection and try again.
        </p>
        <button
          onClick={handleRefresh}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </CardContent>
    </Card>
  );

  if (error) return <ErrorState />;

  return (
    <div className="fundos-dashboard-section-admin">
      {/* Table Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold text-gray-900">Subadmin Overview</h2>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={handleRefresh}
                disabled={isRefreshing || isFetching}
                className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Refresh data"
              >
                <RefreshCw
                  className={`w-4 h-4 text-gray-600 ${
                    isRefreshing || isFetching ? 'animate-spin' : ''
                  }`}
                />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" className="bg-gray-900 text-white border-gray-700">
              <span>Refresh to get fresh data</span>
            </TooltipContent>
          </Tooltip>
        </div>
        
        {/* Records per page selector */}
        <div className="flex items-center gap-2">
          <label htmlFor="pageSizeSelect" className="text-sm font-medium text-gray-700">
            Show:
          </label>
          <Select onValueChange={handlePageSizeChange} defaultValue={String(pageSize)}>
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {pageSizesList.map(ps => (
                <SelectItem key={ps} value={String(ps)}>
                  {ps}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table Content */}
      {!data?.subadmins || data.subadmins.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold text-gray-900">Name</TableHead>
                  <TableHead className="font-semibold text-gray-900">Email</TableHead>
                  <TableHead className="font-semibold text-gray-900">Invite Code</TableHead>
                  <TableHead className="font-semibold text-gray-900 text-center">
                    Total Investors
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900 text-center">
                    Active Deals
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Onboarding Date
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.subadmins.map((admin, index) => (
                  <TableRow
                    key={admin.subadmin_id}
                    className={`border-gray-200 hover:bg-gray-50 transition-colors ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                    }`}
                  >
                    <TableCell className="font-medium text-gray-900">
                      {admin.subadmin_name}
                    </TableCell>
                    <TableCell className="text-gray-600">{admin.email}</TableCell>
                    <TableCell className="font-mono text-sm text-blue-600 bg-blue-50 rounded px-2 py-1">
                      {admin.invitation_code}
                    </TableCell>
                    <TableCell className="text-center font-semibold text-gray-900">
                      {admin.total_users}
                    </TableCell>
                    <TableCell className="text-center font-semibold text-gray-900">
                      {admin.active_deals}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {admin.onboarding_date}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {pagination && pagination.total_pages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-600">
                Total records: {pagination.total_records}
              </div>
              
              <Pagination>
                <PaginationContent className="gap-2">
                  <PaginationItem className={!pagination.has_prev ? 'opacity-50' : 'cursor-pointer'}>
                    <PaginationPrevious onClick={handlePrev} aria-disabled={!pagination.has_prev} />
                  </PaginationItem>
                  
                  <div className="flex gap-1">
                    {Array.from({ length: pagination.total_pages || 1 }, (_, idx) => (
                      <PaginationItem key={idx + 1} className="cursor-pointer">
                        <PaginationLink
                          isActive={pageNumber === idx + 1}
                          onClick={e => {
                            e.preventDefault();
                            setPageNumber(idx + 1);
                          }}
                        >
                          {idx + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                  </div>
                  
                  <PaginationItem className={!pagination.has_next ? 'opacity-50' : 'cursor-pointer'}>
                    <PaginationNext onClick={handleNext} aria-disabled={!pagination.has_next} />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default AdminOverviewTable;

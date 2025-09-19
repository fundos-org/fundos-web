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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { InvestorEntity } from '@/constants/membersConstant';
import { useDealInvestorCommitments } from '@/hooks/customhooks/DealsHooks/useDealInvestorCommitments';
import { formatStatus, formatCurrency, formatInvestorType } from '@/lib/formatUtils';
import { RefreshCw, SquareArrowOutUpRight } from 'lucide-react';
import { FC, lazy, Suspense, useState } from 'react';
import { useNotification } from '@/components/custom/NotificationProvider';
const InvestorDetailsDialog = lazy(
  () => import('../../InvestorSection/DialogItems/InvestorDetailsDialog')
);

const pageSizesList = [6, 10, 20, 50];

const DealCommitments: FC<{ deal_id: string }> = ({ deal_id }) => {
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(6);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [investor, setInvestor] = useState<InvestorEntity | null>();
  const notification = useNotification();
  const { data, error, isLoading, refetch } = useDealInvestorCommitments(
    deal_id,
    pageNumber,
    pageSize
  );

  // Debug logging (remove in production)
  // console.log('DealCommitments Debug:', { deal_id, data, error, isLoading });

  // If no deal_id is provided
  if (!deal_id) {
    return (
      <div className="w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="text-center py-8 text-red-600">
          <strong>Error:</strong> No deal ID provided to load commitments
        </div>
      </div>
    );
  }

  if (error) {
    console.error('DealCommitments Error:', error);
    return <div className="text-center py-8 text-red-600">Error occurred: {error.message}</div>;
  }

  if (!data && !isLoading) {
    return <div className="text-center py-8 text-gray-500">No data found. Check session or API.</div>;
  }
  
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
      const result = await refetch();
      if (result.data?.commitments) {
        notification.success(
          'Commitments Refreshed',
          `Successfully loaded ${result.data.commitments.length} investor commitments`,
          { duration: 3000 }
        );
      }
    } catch (error) {
      console.error('Refresh error:', error);
      notification.error(
        'Refresh Failed',
        'Unable to refresh commitments. Please try again.'
      );
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };
  // Show loading state
  if (isLoading) {
    return (
      <div className="w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading commitments...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="w-full fundos-dashboard-section-admin">
        <div className="fundos-dashboard-header flex justify-between items-center py-4 bg-gray-50 px-6 border-b border-gray-200">
          <h2 className="fundos-dashboard-title text-xl font-semibold text-gray-900">Investor Commitments in this Deal</h2>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing || isLoading}
            className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            title="Refresh data"
          >
            <RefreshCw
              className={`w-5 h-5 text-gray-600 ${
                isRefreshing || isLoading ? 'animate-spin' : ''
              } transition-transform duration-200`}
            />
          </button>
        </div>
        
        <div className="border border-gray-200 rounded-lg overflow-hidden w-full">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold text-gray-900 text-left">Name</TableHead>
                <TableHead className="font-semibold text-gray-900 text-center">Commitment</TableHead>
                <TableHead className="font-semibold text-gray-900 text-center">Deal Committed</TableHead>
                <TableHead className="font-semibold text-gray-900 text-left">Email</TableHead>
                <TableHead className="font-semibold text-gray-900 text-left">Type</TableHead>
                <TableHead className="font-semibold text-gray-900 text-left">KYC Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.commitments && data.commitments.length > 0 ? (
                data?.commitments?.map((commitment, index) => (
                  <TableRow
                    key={commitment.investor_id}
                    className={`border-gray-200 hover:bg-gray-50 transition-colors ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                    }`}
                  >
                    <TableCell className="text-gray-900">
                      <button
                        onClick={() => setInvestor(commitment)}
                        className="flex items-center gap-2 text-blue-600 hover:underline hover:text-blue-700 cursor-pointer transition-colors font-medium"
                      >
                        <span>{commitment.name}</span>
                        <SquareArrowOutUpRight className="w-4 h-4 text-blue-500" />
                      </button>
                    </TableCell>
                    <TableCell className="text-gray-900 text-center font-medium">
                      {formatCurrency(commitment.capital_commitment)}
                    </TableCell>
                    <TableCell className="text-gray-900 text-center font-medium">
                      {commitment.deals_committed}
                    </TableCell>
                    <TableCell className="text-gray-900">
                      {commitment.mail}
                    </TableCell>
                    <TableCell className="text-gray-900">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                        {formatInvestorType(commitment.type)}
                      </span>
                    </TableCell>
                    <TableCell className="text-gray-900">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                        commitment.kyc_status === 'VERIFIED' 
                          ? 'bg-green-100 text-green-800 border-green-200'
                          : commitment.kyc_status === 'PENDING'
                          ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                          : 'bg-red-100 text-red-800 border-red-200'
                      }`}>
                        {formatStatus(commitment.kyc_status)}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-gray-500">
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-sm">This deal has no investor commitments yet.</span>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        
        {data?.commitments && data.commitments.length > 0 && (
          <div className="flex items-center justify-between bg-white p-4 border-t border-gray-200">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">{(pageNumber - 1) * pageSize + 1}</span> to{' '}
              <span className="font-medium">
                {Math.min(pageNumber * pageSize, data?.pagination?.total_records || 0)}
              </span>{' '}
              of <span className="font-medium">{data?.pagination?.total_records || 0}</span> results
            </div>
            <Pagination>
              <PaginationContent className="gap-2">
                <PaginationItem className={!pagination?.has_prev ? 'opacity-50' : 'cursor-pointer'}>
                  <PaginationPrevious
                    className="rounded-lg hover:bg-gray-50"
                    onClick={handlePrev}
                    aria-disabled={!pagination?.has_prev}
                  />
                </PaginationItem>
                <div className="flex gap-1">
                  {Array.from(
                    { length: pagination?.total_pages || 1 },
                    (_, idx) => (
                      <PaginationItem key={idx + 1} className="cursor-pointer">
                        <PaginationLink
                          className={`rounded-lg hover:bg-gray-50 ${
                            pageNumber === idx + 1 
                              ? 'bg-blue-600 text-white hover:bg-blue-700' 
                              : 'text-gray-700 hover:text-gray-900'
                          }`}
                          isActive={pageNumber === idx + 1}
                          onClick={e => {
                            e.preventDefault();
                            setPageNumber(idx + 1);
                          }}
                        >
                          {idx + 1}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  )}
                </div>
                <PaginationItem className={!pagination?.has_next ? 'opacity-50' : 'cursor-pointer'}>
                  <PaginationNext className="rounded-lg hover:bg-gray-50" onClick={handleNext} />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
            <div className="flex items-center gap-2">
              <label htmlFor="pageSizeSelect" className="text-sm font-medium text-gray-700">
                Show:
              </label>
              <Select
                onValueChange={handlePageSizeChange}
                defaultValue={String(pageSize)}
              >
                <SelectTrigger className="w-20 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200 rounded-lg">
                  {pageSizesList.map(ps => (
                    <SelectItem key={ps} value={String(ps)}>
                      {ps}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>
      {investor && (
        <Suspense fallback={<div>Loading...</div>}>
          <InvestorDetailsDialog investor={investor} setInvestor={setInvestor} />
        </Suspense>
      )}
    </>
  );
};

export default DealCommitments;

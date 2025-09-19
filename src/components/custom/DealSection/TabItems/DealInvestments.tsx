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
import SwitchCustom from '@/components/ui/switchCustom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { InvestorForDeals } from '@/constants/dealsConstant';
import { useDealInvestorInvestments } from '@/hooks/customhooks/DealsHooks/useDealInvestorInvestments';
import { formatStatus, formatCurrency, formatDate, formatInvestorType } from '@/lib/formatUtils';
import { RefreshCw, SquareArrowOutUpRight } from 'lucide-react';
import { FC, useState } from 'react';
// const InvestorFileDisplayDialog = lazy(
//   () => import('../../InvestorSection/DialogItems/InvestorFileDisplayDialog')
// );

// const test =
//   'deals/pitch_decks/18e75944-883f-46b5-b716-22c61cc3a061_20250510134038.png'; //delete later

const pageSizesList = [6, 10, 20, 50];

const DealInvestments: FC<{ deal_id: string }> = ({ deal_id }) => {
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(6);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  // const [awsObjectKey, setAwsObjectKey] = useState<string | null>(null);
  const { data, error, isLoading, refetch } = useDealInvestorInvestments(
    deal_id,
    pageNumber,
    pageSize
  );
  if (error) return <div>Error occured please check api</div>;

  if (!data && !isLoading) {
    return <div>No data found. Check session or API.</div>;
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
      await refetch();
    } finally {
      setTimeout(() => setIsRefreshing(false), 500); // Small delay for better UX
    }
  };
  return (
    <>
      <div className="w-full fundos-dashboard-section-admin">
        <div className="fundos-dashboard-header flex justify-between items-center py-4 bg-gray-50 px-6 border-b border-gray-200">
          <h2 className="fundos-dashboard-title text-xl font-semibold text-gray-900">
            Investors Invested in this Deal
          </h2>
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
                <TableHead className="font-semibold text-gray-900 text-left">Action</TableHead>
                <TableHead className="font-semibold text-gray-900 text-left">Name</TableHead>
                <TableHead className="font-semibold text-gray-900 text-center">Type</TableHead>
                <TableHead className="font-semibold text-gray-900 text-center">Commitments</TableHead>
                <TableHead className="font-semibold text-gray-900 text-center">Date</TableHead>
                <TableHead className="font-semibold text-gray-900 text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="overflow-hidden">
              {data?.investors && data.investors.length > 0 ? (
                data?.investors?.map((investor: InvestorForDeals, index) => (
                  <TableRow
                    key={investor.investor_id}
                    className={`border-gray-200 hover:bg-gray-50 transition-colors ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                    }`}
                  >
                    <TableCell className="text-gray-900">
                      <SwitchCustom 
                        checked={investor.status?.toLowerCase() === 'active'}
                        onCheckedChange={(checked) => {
                          // TODO: Implement actual API call to toggle investor status
                          console.log(`Toggle investor ${investor.first_name} ${investor.last_name} to ${checked ? 'active' : 'inactive'}`);
                        }}
                        label="Active"
                      />
                    </TableCell>
                    <TableCell className="text-gray-900">
                      <button className="flex items-center gap-2 text-blue-600 hover:underline hover:text-blue-700 cursor-pointer transition-colors font-medium">
                        <span>{investor.first_name + ' ' + investor.last_name}</span>
                        <SquareArrowOutUpRight className="w-4 h-4 text-blue-500" />
                      </button>
                    </TableCell>
                    <TableCell className="text-gray-900 text-center">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                        {formatInvestorType(investor.investor_type)}
                      </span>
                    </TableCell>
                    <TableCell className="text-gray-900 text-center font-medium">
                      {formatCurrency(investor.commitments)}
                    </TableCell>
                    <TableCell className="text-gray-900 text-center font-medium">
                      {formatDate(investor.created_at)}
                    </TableCell>
                    <TableCell className="text-gray-900 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                        investor.status?.toLowerCase().includes('active') 
                          ? 'bg-green-100 text-green-800 border-green-200'
                          : investor.status?.toLowerCase().includes('pending')
                          ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                          : 'bg-red-100 text-red-800 border-red-200'
                      }`}>
                        {formatStatus(investor.status)}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-gray-500">
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-sm">This deal has no investments yet.</span>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        {(data?.investors?.length ?? 0) > 0 && (
          <div className="flex items-center justify-between bg-white p-4 border-t border-gray-200">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">{(pageNumber - 1) * pageSize + 1}</span> to{' '}
              <span className="font-medium">
                {Math.min(pageNumber * pageSize, data?.pagination?.total_records || 0)}
              </span>{' '}
              of <span className="font-medium">{data?.pagination?.total_records || 0}</span> results
            </div>
            <Pagination className="flex items-center gap-2">
              <PaginationContent className="flex items-center gap-2">
                <PaginationItem
                  className={`${!pagination?.has_prev ? 'hidden' : null} cursor-pointer`}
                >
                  <PaginationPrevious
                    className="rounded-lg hover:bg-gray-50"
                    onClick={handlePrev}
                    aria-disabled={!pagination?.has_prev}
                  />
                </PaginationItem>
                <div className="flex gap-2">
                  {Array.from(
                    { length: pagination?.total_pages || 1 },
                    (_, idx) => (
                      <PaginationItem key={idx + 1} className="cursor-pointer">
                        <PaginationLink
                          className={`rounded-lg hover:bg-gray-50 ${pageNumber === idx + 1 ? 'bg-blue-600 text-white hover:bg-blue-700' : 'text-gray-700'}`}
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
                <PaginationItem
                  className={`${!pagination?.has_next ? 'hidden' : null} cursor-pointer`}
                >
                  <PaginationNext className="rounded-lg hover:bg-gray-50" onClick={handleNext} />
                </PaginationItem>
              </PaginationContent>
              <div className="flex items-center gap-2">
                <label htmlFor="pageSizeSelect" className="text-sm font-medium text-gray-700">
                  Records per page:
                </label>
                <Select
                  onValueChange={handlePageSizeChange}
                  defaultValue={String(pageSize)}
                >
                  <SelectTrigger className="w-20 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg">
                    <SelectValue placeholder="Select Page Size" />
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
            </Pagination>
          </div>
        )}
      </div>
      {/* <Suspense fallback={<div>Loading...</div>}>
        <InvestorFileDisplayDialog
          // awsObjectKey={sendDetails?.investor_id} // needed this comment
          awsObjectKey={awsObjectKey}
          setAwsObjectKey={setAwsObjectKey}
        />
      </Suspense> */}
    </>
  );
};

export default DealInvestments;

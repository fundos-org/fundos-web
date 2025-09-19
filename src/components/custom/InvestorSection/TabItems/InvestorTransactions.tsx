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
import { AppEnums } from '@/constants/enums';
import { useInvestorTransactions } from '@/hooks/customhooks/MembersHooks/useInvestorTransactions';
import { FC, useState } from 'react';

const pageSizesList = [3, 6, 9, 18, 50];

const InvestorTransactions: FC<{ investor_id: string }> = ({ investor_id }) => {
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(6);
  const [subadminIdFromSession] = useState<string | undefined | null>(() =>
    sessionStorage.getItem(AppEnums.CAPDRPDWNCHGE)
  );
  const { data } = useInvestorTransactions(
    pageNumber,
    pageSize,
    investor_id,
    subadminIdFromSession
  );

  const handleNext = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    if (
      data?.pagination?.has_next &&
      pageNumber < (data?.pagination?.total_pages || 1)
    ) {
      setPageNumber(prev => prev + 1);
    }
  };

  const handlePageSizeChange = (value: string) => {
    setPageSize(Number(value));
    setPageNumber(1);
  };
  const handlePrev = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    if (data?.pagination?.has_prev && pageNumber > 1) {
      setPageNumber(prev => prev - 1);
    }
  };

  return (
    <div className="flex flex-col w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="flex justify-between items-center py-4 bg-gray-50 px-6 border-b border-gray-200">
        <h1 className="text-xl font-semibold text-gray-900">
          Investor Transactions
        </h1>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold text-gray-900 text-left">Transaction Type</TableHead>
              <TableHead className="font-semibold text-gray-900 text-center">Amount(INR)</TableHead>
              <TableHead className="font-semibold text-gray-900 text-center">Currency</TableHead>
              <TableHead className="font-semibold text-gray-900 text-center">Status</TableHead>
              <TableHead className="font-semibold text-gray-900 text-center">Txn Date</TableHead>
              <TableHead className="font-semibold text-gray-900 text-center">Invitation Code</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.transactions &&
            data?.transactions?.map((transaction, idx) => (
              <TableRow key={idx + 1} className="hover:bg-gray-50 transition-colors">
                <TableCell className="font-medium">
                  {transaction.transaction_type}
                </TableCell>
                <TableCell className="font-medium text-center text-gray-900">
                  ₹{transaction.amount?.toLocaleString()}
                </TableCell>
                <TableCell className="font-medium text-center">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                    {transaction.currency}
                  </span>
                </TableCell>
                <TableCell className="font-medium text-center">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border capitalize ${
                    transaction.status?.toLowerCase() === 'success' || transaction.status?.toLowerCase() === 'completed'
                      ? 'bg-green-100 text-green-800 border-green-200'
                      : transaction.status?.toLowerCase() === 'pending'
                      ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                      : 'bg-red-100 text-red-800 border-red-200'
                  }`}>
                    {transaction.status}
                  </span>
                </TableCell>
                <TableCell className="font-medium text-center">
                  {transaction.created_at}
                </TableCell>
                <TableCell className="font-medium">
                  {transaction.invitation_code}
                </TableCell>
              </TableRow>
            ))}
          {(!data?.transactions || data?.transactions?.length === 0) && (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-12 text-gray-500">
                <div className="flex flex-col items-center gap-3">
                  <span className="text-sm">This investor has no transactions yet.</span>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
        </Table>
      </div>
      {(data?.transactions?.length ?? 0) > 0 && (
        <div className="bg-white border-t border-gray-200 p-4 flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">
            Total records: <span className="font-semibold text-gray-900">{data?.pagination?.total_records}</span>
          </span>
          <Pagination className="flex items-center gap-2">
            <PaginationContent className="flex items-center gap-2">
            <PaginationItem
              className={`${!data?.pagination?.has_prev ? 'hidden' : null} cursor-pointer`}
            >
              <PaginationPrevious
                className="rounded-lg hover:bg-gray-50"
                onClick={handlePrev}
                aria-disabled={!data?.pagination?.has_prev}
              />
            </PaginationItem>
            <div className="flex gap-2">
              {Array.from(
                { length: data?.pagination?.total_pages || 1 },
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
              className={`${!data?.pagination?.has_next ? 'hidden' : null} cursor-pointer`}
            >
              <PaginationNext className="rounded-lg hover:bg-gray-50" onClick={handleNext} />
            </PaginationItem>
          </PaginationContent>
          <div className="flex items-center">
            <label htmlFor="pageSizeSelect" className="text-sm font-medium text-gray-700">
              Records per page:&nbsp;
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
  );
};

export default InvestorTransactions;

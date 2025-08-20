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
import { DealTransaction } from '@/constants/dealsConstant';
import { useDealTransactions } from '@/hooks/customhooks/DealsHooks/useDealTransactions';
import { RefreshCw } from 'lucide-react';
import { FC, useState } from 'react';

const pageSizesList = [6, 10, 20, 50];

const DealTransactions: FC<{ deal_id: string }> = ({ deal_id }) => {
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(6);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const { data, isLoading, error, refetch } = useDealTransactions(
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
    <div className="w-full border border-[#2A2A2B]">
      <div className="flex justify-between items-center py-3 bg-[#2A2A2B] px-5">
        <h1 className="text-2xl text-zinc-400">Deal Transactions</h1>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing || isLoading}
          className="flex gap-3 p-2 bg-zinc-700 hover:bg-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 cursor-pointer"
          title="Refresh data"
        >
          {/* <span>Refresh:</span> */}
          <RefreshCw
            className={`w-5 h-5 text-zinc-400 ${
              isRefreshing || isLoading ? 'animate-spin' : null
            } transition-transform duration-200 hover:text-zinc-300`}
          />
        </button>
      </div>
      <div className="grid w-full [&>div]:min-h-[calc(100vh-30rem)] [&>div]:border-0 custom-scrollbar-table">
        <Table className="rounded-none">
          <TableHeader>
            <TableRow className="[&>*]:whitespace-nowrap sticky bg-black z-2 top-0 after:content-[''] after:inset-x-0 after:h-px after:border-b after:absolute after:bottom after:border-zinc-400/60 border-zinc-400/60">
              <TableHead className="text-zinc-400 pl-4">
                Transaction ID
              </TableHead>
              <TableHead className="text-zinc-400">Transaction Type</TableHead>
              <TableHead className="text-zinc-400">Amount</TableHead>
              <TableHead className="text-zinc-400">Date</TableHead>
              <TableHead className="text-zinc-400">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="overflow-hidden">
            {data?.transactions && data.transactions.length > 0 ? (
              data?.transactions?.map((transaction: DealTransaction) => (
                <TableRow
                  className="border-[#2A2A2B] odd:bg-muted/5 [&>*]:whitespace-nowrap"
                  key={transaction.transaction_id}
                >
                  <TableCell className="font-medium pl-4 capitalize">
                    {transaction.transaction_id}
                  </TableCell>
                  <TableCell className="font-medium capitalize">
                    {transaction.transaction_type}
                  </TableCell>
                  <TableCell className="font-medium">
                    {transaction.amount}
                  </TableCell>
                  <TableCell className="font-medium">
                    {transaction.created_at}
                  </TableCell>
                  <TableCell className="font-medium uppercase">
                    {transaction.status}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={10}
                  className="text-center py-8 text-zinc-400"
                >
                  No transactions found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <Pagination className="bg-[#2A2A2B] p-2 flex justify-between items-center">
        <span>Total records: {data?.pagination.total_records}</span>
        <PaginationContent className="gap-10">
          <PaginationItem
            className={`${!pagination?.has_prev ? 'hidden' : null} cursor-pointer`}
          >
            <PaginationPrevious
              className="rounded-none"
              onClick={handlePrev}
              aria-disabled={!pagination?.has_prev}
            />
          </PaginationItem>
          <div className="flex gap-2">
            {Array.from({ length: pagination?.total_pages || 1 }, (_, idx) => (
              <PaginationItem key={idx + 1} className="cursor-pointer">
                <PaginationLink
                  className={`${pageNumber === idx + 1 ? 'text-black' : 'text-white'} rounded-none`}
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
          <PaginationItem
            className={`${!pagination?.has_next ? 'hidden' : null} cursor-pointer`}
          >
            <PaginationNext className="rounded-none" onClick={handleNext} />
          </PaginationItem>
        </PaginationContent>
        <div className="flex items-center">
          <label htmlFor="pageSizeSelect" className="text-sm font-medium">
            Records per page:&nbsp;
          </label>
          <Select
            onValueChange={handlePageSizeChange}
            defaultValue={String(pageSize)}
          >
            <SelectTrigger className="rounded-none w-[100px]">
              <SelectValue placeholder="Select Page Size" />
            </SelectTrigger>
            <SelectContent className="rounded-none">
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
  );
};

export default DealTransactions;

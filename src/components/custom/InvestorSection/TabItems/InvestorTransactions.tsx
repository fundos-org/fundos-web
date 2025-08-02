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
import { useInvestorTransactions } from '@/hooks/customhooks/MembersHooks/useInvestorTransactions';
import { FC, useState } from 'react';

const pageSizesList = [3, 6, 9, 18, 50];

const InvestorTransactions: FC<{ investor_id: string }> = ({ investor_id }) => {
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(6);
  const { data } = useInvestorTransactions(pageNumber, pageSize, investor_id);

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
    <div className="flex flex-col w-full border border-[#383739]">
      <Table className="rounded-none">
        <TableHeader className="bg-[#2A2A2B]">
          <TableRow className="border-zinc-400/60">
            <TableHead className="text-zinc-400">Transaction Type</TableHead>
            <TableHead className="text-zinc-400">Amount(INR)</TableHead>
            <TableHead className="text-zinc-400">Currency</TableHead>
            <TableHead className="text-zinc-400">Status</TableHead>
            <TableHead className="text-zinc-400">Txn Date</TableHead>
            <TableHead className="text-zinc-400">Invitation Code</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.transactions &&
            data?.transactions?.map((transaction, idx) => (
              <TableRow className="border-[#2A2A2B]" key={idx + 1}>
                <TableCell className="font-medium">
                  {transaction.transaction_type}
                </TableCell>
                <TableCell className="font-medium">
                  {transaction.amount}
                </TableCell>
                <TableCell className="font-medium">
                  {transaction.currency}
                </TableCell>
                <TableCell className="font-medium capitalize">
                  {transaction.status}
                </TableCell>
                <TableCell className="font-medium text-center">
                  {transaction.created_at}
                </TableCell>
                <TableCell className="font-medium">
                  {transaction.invitation_code}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      {(data?.transactions?.length ?? 0) > 0 && (
        <Pagination className="bg-[#2A2A2B] p-2 flex justify-between items-center">
          <span>Total records: {data?.pagination?.total_records}</span>
          <PaginationContent className="gap-10">
            <PaginationItem
              className={`${!data?.pagination?.has_prev ? 'hidden' : null} cursor-pointer`}
            >
              <PaginationPrevious
                className="rounded-none"
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
                )
              )}
            </div>
            <PaginationItem
              className={`${!data?.pagination?.has_next ? 'hidden' : null} cursor-pointer`}
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
      )}
    </div>
  );
};

export default InvestorTransactions;

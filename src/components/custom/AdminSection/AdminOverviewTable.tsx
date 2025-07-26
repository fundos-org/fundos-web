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
import { RefreshCw } from 'lucide-react';
import { useState } from 'react';

const pageSizesList = [6, 10, 20, 50];

function AdminOverviewTable() {
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(6);
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
  return (
    <>
      <div className="w-full border border-[#2A2A2B] mt-7">
        <div className="flex justify-between items-center py-3 bg-[#2A2A2B] px-5">
          <div className="flex gap-2">
            <h1 className="text-2xl text-zinc-400 uppercase">
              Subadmin's Overview
            </h1>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={handleRefresh}
                  disabled={isRefreshing || isFetching}
                  className="flex gap-3 rounded-full items-center px-1.5 bg-zinc-700 hover:bg-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 cursor-pointer"
                  title="Refresh data"
                >
                  <RefreshCw
                    className={`w-5 h-5 text-zinc-400 ${
                      isRefreshing || isFetching ? 'animate-spin' : null
                    } transition-transform duration-200 hover:text-zinc-300`}
                  />
                </button>
              </TooltipTrigger>
              <TooltipContent
                side="right"
                className="bg-[#ffffff40] border border-[#ffffff70] rounded-none [&>svg]:fill-blue-900"
              >
                <strong>Refresh to get Fresh Data</strong>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
        <div className="grid w-full [&>div]:max-h-[calc(100vh-30rem)] [&>div]:border-0 custom-scrollbar-table">
          <Table className="rounded-none">
            <TableHeader>
              <TableRow className="[&>*]:whitespace-nowrap sticky bg-black z-2 top-0 after:content-[''] after:inset-x-0 after:h-px after:border-b after:absolute after:bottom after:border-zinc-400/60 border-zinc-400/60">
                <TableHead className="text-zinc-400">Name</TableHead>
                <TableHead className="text-zinc-400">Mail</TableHead>
                <TableHead className="text-zinc-400">Invite Code</TableHead>
                <TableHead className="text-zinc-400 text-center">
                  Total Investors
                </TableHead>
                <TableHead className="text-zinc-400 text-center">
                  Active Deals
                </TableHead>
                <TableHead className="text-zinc-400">Onboarding Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="overflow-hidden">
              {data?.admins &&
                data?.admins?.map(admin => (
                  <TableRow
                    className="border-[#2A2A2B] odd:bg-muted/5 [&>*]:whitespace-nowrap"
                    key={admin.admin_id}
                  >
                    <TableCell className="font-medium">
                      {admin.admin_name}
                    </TableCell>
                    <TableCell className="font-medium">{admin.email}</TableCell>
                    <TableCell className="font-medium">
                      {admin.invitation_code}
                    </TableCell>
                    <TableCell className="font-medium text-center">
                      {admin.total_users}
                    </TableCell>
                    <TableCell className="font-medium text-center">
                      {admin.active_deals}
                    </TableCell>
                    <TableCell className="font-medium">
                      {admin.onboarding_date}
                    </TableCell>
                  </TableRow>
                ))}
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
              {Array.from(
                { length: pagination?.total_pages || 1 },
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
    </>
  );
}

export default AdminOverviewTable;

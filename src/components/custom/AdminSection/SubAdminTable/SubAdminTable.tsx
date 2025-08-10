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
import { UserPen, RefreshCw, ArchiveX } from 'lucide-react';
import { FC, lazy, Suspense, useState } from 'react';
import SwitchCustom from '@/components/ui/switchCustom';
import { useSubadminsTable } from '@/hooks/customhooks/SubAdminsHooks/useSubadminTable';
import { Subadmin } from '@/constants/dealsConstant';
const SubAdminEditDialog = lazy(
  () => import('../DialogItems/SubAdminEditDialog')
);

const pageSizesList = [6, 10, 20, 50];

const SubAdminTable: FC = () => {
  const [subAadminId, setSubAadminId] = useState<string | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(6);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const { data, isLoading, error, refetch } = useSubadminsTable(
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
      <div className="w-full border border-[#2A2A2B]">
        <div className="flex justify-between items-center py-3 bg-[#2A2A2B] px-5">
          <h1 className="text-2xl text-zinc-400">SUBADMINS</h1>
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
        <div className="grid w-full [&>div]:max-h-[calc(100vh-30rem)] [&>div]:border-0 custom-scrollbar-table">
          <Table className="rounded-none">
            <TableHeader>
              <TableRow className="[&>*]:whitespace-nowrap sticky bg-black z-2 top-0 after:content-[''] after:inset-x-0 after:h-px after:absolute bottom-0 border-zinc-700">
                <TableHead className="text-zinc-400 pl-4">Action</TableHead>
                <TableHead className="text-zinc-400">Sub-AdminName</TableHead>
                <TableHead className="text-zinc-400">Email</TableHead>
                <TableHead className="text-zinc-400">Invitation Code</TableHead>
                <TableHead className="text-zinc-400">Total Users</TableHead>
                <TableHead className="text-zinc-400">Active Deals</TableHead>
                <TableHead className="text-zinc-400">Onboarding Date</TableHead>
                <TableHead className="text-zinc-400">Edit</TableHead>
                <TableHead className="text-zinc-400">Archive</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="overflow-hidden">
              {data?.subadmins &&
                data?.subadmins?.map((subadmin: Subadmin) => (
                  <TableRow
                    className="border-[#2A2A2B] odd:bg-muted/5 [&>*]:whitespace-nowrap"
                    key={subadmin.subadmin_id}
                  >
                    <TableCell className="font-medium pl-4">
                      <SwitchCustom />
                    </TableCell>
                    <TableCell className="font-medium capitalize">
                      {subadmin.subadmin_name}
                    </TableCell>
                    <TableCell className="font-medium">
                      {subadmin.email}
                    </TableCell>
                    <TableCell className="font-medium capitalize">
                      {subadmin.invitation_code}
                    </TableCell>
                    <TableCell className="font-medium px-10">
                      {subadmin.total_users}
                    </TableCell>
                    <TableCell className="font-medium px-10">
                      {subadmin.active_deals}
                    </TableCell>
                    <TableCell className="font-medium">
                      {subadmin.onboarding_date}
                    </TableCell>
                    <TableCell
                      className="font-medium"
                      onClick={() => setSubAadminId(subadmin.subadmin_id)}
                    >
                      <UserPen className="text-blue-400" />
                    </TableCell>
                    <TableCell align="center" className="font-medium">
                      <ArchiveX className="text-red-500 text-center" />
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
      <Suspense fallback={<div className="spinner">Loading...</div>}>
        <SubAdminEditDialog
          subadminId={subAadminId}
          setSubadminId={setSubAadminId}
        />
      </Suspense>
    </>
  );
};

export default SubAdminTable;

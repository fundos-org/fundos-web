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
  const [pageSize, setPageSize] = useState<number>(20);
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
      <div className="w-full border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        <div className="flex justify-between items-center py-4 bg-gray-50 border-b border-gray-200 px-6">
          <h1 className="text-xl font-semibold text-gray-900">Sub Admins</h1>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing || isLoading}
            className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Refresh data"
          >
            <RefreshCw
              className={`w-5 h-5 text-gray-600 ${
                isRefreshing || isLoading ? 'animate-spin' : ''
              } transition-transform duration-200`}
            />
          </button>
        </div>
        <div className="grid w-full [&>div]:min-h-[56vh] [&>div]:border-0 custom-scrollbar-table">
          <Table className="rounded-none">
            <TableHeader>
              <TableRow className="[&>*]:whitespace-nowrap sticky bg-gray-50 z-2 top-0 border-b border-gray-200 hover:bg-gray-50">
                <TableHead className="font-semibold text-gray-900 pl-6">Action</TableHead>
                <TableHead className="font-semibold text-gray-900">Sub Admin Name</TableHead>
                <TableHead className="font-semibold text-gray-900">Email</TableHead>
                <TableHead className="font-semibold text-gray-900">Invitation Code</TableHead>
                <TableHead className="font-semibold text-gray-900 text-center">Total Users</TableHead>
                <TableHead className="font-semibold text-gray-900 text-center">Active Deals</TableHead>
                <TableHead className="font-semibold text-gray-900">Onboarding Date</TableHead>
                <TableHead className="font-semibold text-gray-900">Edit</TableHead>
                <TableHead className="font-semibold text-gray-900">Archive</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="overflow-hidden">
              {data?.subadmins && data.subadmins.length > 0 ? (
                data.subadmins.map((subadmin: Subadmin, index: number) => (
                  <TableRow
                    className={`border-b border-gray-200 hover:bg-gray-50 [&>*]:whitespace-nowrap transition-colors ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                    }`}
                    key={subadmin.subadmin_id}
                  >
                    <TableCell className="font-medium pl-6">
                      <SwitchCustom />
                    </TableCell>
                    <TableCell className="font-medium text-gray-900 capitalize">
                      {subadmin.subadmin_name}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {subadmin.email}
                    </TableCell>
                    <TableCell className="">
                      <span className="font-mono text-sm text-blue-600 bg-blue-50 rounded-md px-2 py-1">
                        {subadmin.invitation_code}
                      </span>
                    </TableCell>
                    <TableCell className="text-center font-semibold text-gray-900">
                      {subadmin.total_users}
                    </TableCell>
                    <TableCell className="text-center font-semibold text-gray-900">
                      {subadmin.active_deals}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {subadmin.onboarding_date}
                    </TableCell>
                    <TableCell
                      className="cursor-pointer"
                      onClick={() => setSubAadminId(subadmin.subadmin_id)}
                    >
                      <UserPen className="w-5 h-5 text-blue-600 hover:text-blue-700 transition-colors" />
                    </TableCell>
                    <TableCell className="text-center">
                      <ArchiveX className="w-5 h-5 text-red-500 hover:text-red-600 transition-colors cursor-pointer" />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                    No sub admins found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-between items-center">
          <span className="text-sm text-gray-700 font-medium">
            Total records: <span className="font-semibold">{data?.pagination.total_records || 0}</span>
          </span>
          <Pagination className="mx-0">
            <PaginationContent className="gap-2">
              <PaginationItem
                className={`${!pagination?.has_prev ? 'hidden' : ''} cursor-pointer`}
              >
                <PaginationPrevious
                  className="rounded-lg border-gray-300 hover:bg-gray-100"
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
                        className={`rounded-lg border-gray-300 ${
                          pageNumber === idx + 1
                            ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700'
                            : 'text-gray-700 hover:bg-gray-100'
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
              <PaginationItem
                className={`${!pagination?.has_next ? 'hidden' : ''} cursor-pointer`}
              >
                <PaginationNext 
                  className="rounded-lg border-gray-300 hover:bg-gray-100" 
                  onClick={handleNext} 
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
          <div className="flex items-center gap-2">
            <label htmlFor="pageSizeSelect" className="text-sm font-medium text-gray-700">
              Records per page:
            </label>
            <Select
              onValueChange={handlePageSizeChange}
              defaultValue={String(pageSize)}
            >
              <SelectTrigger className="rounded-lg border-gray-300 w-[80px] h-8">
                <SelectValue placeholder="Size" />
              </SelectTrigger>
              <SelectContent className="rounded-lg">
                {pageSizesList.map(ps => (
                  <SelectItem key={ps} value={String(ps)}>
                    {ps}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
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

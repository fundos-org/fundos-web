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
import { useInvestorDelete } from '@/hooks/customhooks/MembersHooks/useInvestorDelete';
import { useInvestors } from '@/hooks/customhooks/MembersHooks/useInvestorTable';
import {
  FileText,
  UserPen,
  RefreshCw,
  SquareArrowOutUpRight,
  Trash2,
} from 'lucide-react';
import { FC, lazy, Suspense, useEffect, useState } from 'react';
import SwitchCustom from '@/components/ui/switchCustom';
import { InvestorEntity } from '@/constants/membersConstant';
import { useSubadminIds } from '@/hooks/customhooks/SubAdminsHooks/useSubadminIds';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { AppEnums } from '@/constants/enums';
// import { useLoader } from '@/hooks/useLoader';
const InvestorFileDisplayDialog = lazy(
  () => import('../DialogItems/InvestorFileDisplayDialog')
);
const InvestorDetailsDialog = lazy(
  () => import('../DialogItems/InvestorDetailsDialog')
);
const InvestorEditDialog = lazy(
  () => import('../DialogItems/InvestorEditDialog')
);

interface OpenEditDialog {
  investor_id: string;
  subadmin_id: string;
}

const sessCapture = () => {
  const subadminDetailsRaw = sessionStorage.getItem(AppEnums.SUBADMIN_SESSION);
  const { subadmin_id } = subadminDetailsRaw
    ? JSON.parse(subadminDetailsRaw)
    : {};
  return subadmin_id;
};

const test =
  'deals/pitch_decks/18e75944-883f-46b5-b716-22c61cc3a061_20250510134038.png'; //delete later

const pageSizesList = [6, 10, 20, 50];

const InvestorTable: FC<{ isSubadmin: boolean }> = ({ isSubadmin }) => {
  const [sendDetails, setSendDetails] = useState<InvestorEntity>();
  const [editUser, setEditUser] = useState<OpenEditDialog | null>(null);
  const [openDetails, setOpenDetails] = useState<boolean>(false);
  const [awsObjectKey, setAwsObjectKey] = useState<string | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(6);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isRefreshing1, setIsRefreshing1] = useState<boolean>(false);
  const [subAdminId, setSubAdminId] = useState<string | undefined>(sessCapture);
  // const { showLoader, hideLoader } = useLoader();
  const { data: subadminIds, refetch: refetchIds } = useSubadminIds(isSubadmin);
  const { mutate: deleteInvestor } = useInvestorDelete();
  const {
    data,
    isLoading: isFetching,
    error,
    refetch,
  } = useInvestors(pageNumber, pageSize, subAdminId);

  useEffect(() => {
    // Suggestion: Only set subAdminId if it's undefined and subadminIds is available
    if (!subAdminId) {
      setSubAdminId(subadminIds?.subadmins[0]?.subadmin_id);
    }
  }, [subAdminId, subadminIds]); // Removed subAdminId from dependencies

  // Issue 2: No mechanism to reset pageNumber when subAdminId changes
  // Suggestion: Add useEffect to reset pageNumber and trigger refetch when subAdminId changes
  useEffect(() => {
    // Only refetch if subAdminId is defined to avoid unnecessary API calls
    if (subAdminId && subadminIds && subadminIds?.subadmins?.length > 0) {
      setPageNumber(1); // Reset to first page when subAdminId changes
      refetch(); // Trigger useInvestors hook
    }
  }, [subAdminId, refetch, subadminIds]);

  if (error) return <div>Error occured please check api</div>;

  if (!data) {
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

  const handleSubAdminIdChange = (id: string) => setSubAdminId(id);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
    } finally {
      setTimeout(() => setIsRefreshing(false), 500); // Small delay for better UX
    }
  };
  const handleRefreshIds = async () => {
    setIsRefreshing1(true);
    try {
      await refetchIds();
    } finally {
      setTimeout(() => setIsRefreshing1(false), 500); // Small delay for better UX
    }
  };

  const goInsideDialog = (investor: InvestorEntity) => {
    setOpenDetails(true);
    setSendDetails(investor);
  };
  return (
    <>
      <div className="w-full border border-[#2A2A2B]">
        <div className="flex justify-between items-center py-3 bg-[#2A2A2B] px-5">
          <div className="flex gap-2">
            <h1 className="text-2xl text-zinc-400">INVESTORS ONBOARDED</h1>
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
          {!isSubadmin && (
            <div className="flex">
              <Select onValueChange={handleSubAdminIdChange} value={subAdminId}>
                <SelectTrigger className="rounded-none w-[200px] cursor-pointer border border-[#383739] bg-black/40">
                  <SelectValue placeholder="Select Sub-Admin" />
                </SelectTrigger>
                <SelectContent className="rounded-none">
                  {subadminIds?.subadmins?.map(subadmin => (
                    <SelectItem
                      key={subadmin?.subadmin_id}
                      value={String(subadmin?.subadmin_id)}
                    >
                      {subadmin?.subadmin_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                onClick={handleRefreshIds}
                disabled={isRefreshing1}
                className="rounded-none border border-[#383739] cursor-pointer"
                title="Refresh data"
              >
                <RefreshCw
                  className={`w-5 h-5 text-zinc-400 ${
                    isRefreshing1 ? 'animate-spin' : null
                  } transition-transform duration-200 hover:text-zinc-300`}
                />
              </Button>
            </div>
          )}
        </div>
        <div className="grid w-full [&>div]:max-h-[calc(100vh-30rem)] [&>div]:border-0 custom-scrollbar-table">
          <Table className="rounded-none">
            <TableHeader>
              <TableRow className="[&>*]:whitespace-nowrap sticky bg-black z-2 top-0 after:content-[''] after:inset-x-0 after:h-px after:border-b after:absolute after:bottom after:border-zinc-400/60 border-zinc-400/60">
                <TableHead className="text-zinc-400 pl-4">Action</TableHead>
                <TableHead className="text-zinc-400">Name</TableHead>
                <TableHead className="text-zinc-400">Mail</TableHead>
                <TableHead className="text-zinc-400">Type</TableHead>
                <TableHead className="text-zinc-400 text-center">
                  Deal Invested
                </TableHead>
                <TableHead className="text-zinc-400">KYC Status</TableHead>
                <TableHead className="text-zinc-400">Joining Date</TableHead>
                <TableHead className="text-zinc-400">
                  Capital Commit(INR)
                </TableHead>
                <TableHead className="text-zinc-400">MCA</TableHead>
                {subAdminId && (
                  <TableHead className="text-zinc-400">Edit</TableHead>
                )}
                {subAdminId && (
                  <TableHead className="text-zinc-400">Bin</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody className="overflow-hidden">
              {data?.investors &&
                data?.investors?.map((investor: InvestorEntity) => (
                  <TableRow
                    className="border-[#2A2A2B] odd:bg-muted/5 [&>*]:whitespace-nowrap"
                    key={investor.investor_id}
                  >
                    <TableCell className="font-medium pl-4">
                      <SwitchCustom />
                    </TableCell>
                    <TableCell
                      className="font-medium flex items-center py-2 cursor-pointer hover:underline"
                      onClick={() => goInsideDialog(investor)}
                    >
                      <div className="w-5 h-5 mr-2 mt-2 overflow-hidden rounded-full">
                        <img
                          src={investor.profile_pic}
                          className="w-full h-full object-cover"
                          alt="dp"
                        />
                      </div>
                      <span className="mt-2">{investor.name}</span>
                      <SquareArrowOutUpRight className="w-3 ml-1 mt-2 text-blue-400" />
                    </TableCell>
                    <TableCell className="font-medium">
                      {investor.mail}
                    </TableCell>
                    <TableCell className="font-medium uppercase">
                      {investor.type}
                    </TableCell>
                    <TableCell className="font-medium text-center">
                      {investor.deals_invested}
                    </TableCell>
                    <TableCell className="font-medium uppercase">
                      {investor.kyc_status}
                    </TableCell>
                    <TableCell className="font-medium">
                      {investor.joined_on}
                    </TableCell>
                    <TableCell className="font-medium">
                      {investor.capital_commitment}
                    </TableCell>
                    <TableCell className="font-medium">
                      <FileText
                        onClick={() => setAwsObjectKey(test)}
                        className="cursor-pointer"
                      />
                    </TableCell>
                    {subAdminId && (
                      <TableCell
                        className="font-medium"
                        onClick={() =>
                          setEditUser({
                            investor_id: investor.investor_id,
                            subadmin_id: subAdminId,
                          })
                        }
                      >
                        <UserPen className="text-blue-400" />
                      </TableCell>
                    )}
                    {subAdminId && (
                      <TableCell
                        className="font-medium"
                        onClick={() =>
                          deleteInvestor({
                            investor_id: investor.investor_id,
                            subadmin_id: subAdminId,
                          })
                        }
                      >
                        <Trash2 className="text-red-400 text-center" />
                      </TableCell>
                    )}
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
      <Suspense fallback={<div>Loading...</div>}>
        <InvestorDetailsDialog
          open={openDetails}
          onOpenChange={setOpenDetails}
          details={sendDetails}
        />
      </Suspense>
      <Suspense fallback={<div className="spinner">Loading...</div>}>
        <InvestorEditDialog
          editDetailsOpen={editUser}
          setEditDetailsOpen={setEditUser}
        />
      </Suspense>
      <Suspense fallback={<div>Loading...</div>}>
        <InvestorFileDisplayDialog
          // awsObjectKey={sendDetails?.investor_id} // needed this comment
          awsObjectKey={awsObjectKey}
          setAwsObjectKey={setAwsObjectKey}
        />
      </Suspense>
    </>
  );
};

export default InvestorTable;

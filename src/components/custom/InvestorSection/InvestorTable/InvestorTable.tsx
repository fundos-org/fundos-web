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
import { FileText, RefreshCw, SquareArrowOutUpRight } from 'lucide-react';
import { lazy, Suspense, useState } from 'react';
import SwitchCustom from '@/components/ui/switchCustom';
import AdvancedInvestorActionsCell from './AdvancedInvestorActionsCell';
const InvestorFileDisplayDialog = lazy(
  () => import('../DialogItems/InvestorFileDisplayDialog')
);
const InvestorDetailsDialog = lazy(
  () => import('../DialogItems/InvestorDetailsDialog')
);

export interface InvestorEntity {
  investor_id: string;
  name: string;
  mail: string;
  type: 'entity' | 'individual';
  deals_invested: number;
  kyc_status: 'pending' | 'verified' | 'rejected';
  mca_key: string;
  joined_on: string;
  profile_pic: string;
  capital_commitment: number;
}

export interface Pagination {
  page: number;
  per_page: number;
  total_records: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface InvestorsListResponse {
  subadmin_id: string;
  subadmin_name: string;
  investors: InvestorEntity[];
  pagination: Pagination;
  success: boolean;
}
const test =
  'deals/pitch_decks/18e75944-883f-46b5-b716-22c61cc3a061_20250510134038.png'; //delete later

const pageSizesList = [6, 10, 20, 50];

const InvestorTable = () => {
  const [sendDetails, setSendDetails] = useState<InvestorEntity>();
  const [openDetails, setOpenDetails] = useState<boolean>(false);
  const [awsObjectKey, setAwsObjectKey] = useState<string | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(6);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const { mutate: deleteInvestor } = useInvestorDelete();
  const { data, isLoading, error, refetch } = useInvestors(
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

  const goInsideDialog = (investor: InvestorEntity) => {
    setOpenDetails(true);
    setSendDetails(investor);
  };

  return (
    <>
      <div className="w-full border border-[#2A2A2B]">
        <div className="flex justify-between items-center py-3 bg-[#2A2A2B] px-5">
          <h1 className="text-2xl text-zinc-400">INVESTORS ONBOARDED</h1>
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
              <TableRow className="[&>*]:whitespace-nowrap sticky bg-black z-2 top-0 after:content-[''] after:inset-x-0 after:h-px after:border-b after:absolute after:bottom-0 after:border-zinc-400/60">
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
                <TableHead className="text-zinc-400">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="overflow-hidden">
              {data?.investors &&
                data?.investors?.map(investor => (
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
                    <TableCell className="font-medium capitalize">
                      {investor.type}
                    </TableCell>
                    <TableCell className="font-medium text-center">
                      {investor.deals_invested}
                    </TableCell>
                    <TableCell className="font-medium">
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
                    <AdvancedInvestorActionsCell
                      key={investor.investor_id}
                      investor={investor}
                      deleteInvestor={deleteInvestor}
                    />
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
      <Suspense fallback={<div>Loading...</div>}>
        <InvestorFileDisplayDialog
          // awsObjectKey={sendDetails?.investor_id}
          awsObjectKey={awsObjectKey}
          setAwsObjectKey={setAwsObjectKey}
        />
      </Suspense>
    </>
  );
};

export default InvestorTable;

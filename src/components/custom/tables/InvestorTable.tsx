// import {
//   ChevronDown,
//   // MoreHorizontal
// } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
// import { Button } from '@/components/ui/button';
import {
  Pagination,
  PaginationContent,
  // PaginationEllipsis,
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
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useInvestors } from '@/hooks/customhooks/useInvestorTable';
import {
  FileText,
  MoreHorizontal,
  Pencil,
  RefreshCw,
  Trash2,
} from 'lucide-react';
// import { Ellipsis } from 'lucide-react';
import { useState } from 'react';

// Define the type for the user data
export interface Investor {
  investor_id: string;
  name: string;
  mail: string;
  type: 'entity' | 'individual';
  deals_invested: number;
  kyc_status: 'pending' | 'verified' | 'rejected';
  mca_key: string;
  joined_on: string; // Consider Date if you want to parse it
  profile_pic: string;
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
  investors: Investor[];
  pagination: Pagination;
  success: boolean;
}

const pageSizesList = [5, 10, 20, 50];

const InvestorTable = () => {
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(8);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const { data, isLoading, error, refetch } = useInvestors(
    pageNumber,
    pageSize
  );

  if (!data && !isLoading) {
    return <div>No data found. Check session or API.</div>;
  }

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
    <div className="w-full border border-[#2A2A2B]">
      <div className="flex justify-between items-center py-3 bg-[#2A2A2B] px-5">
        <h1 className="text-2xl text-zinc-400">SUB-ADMIN ONBOARDED</h1>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing || isLoading}
          className="flex gap-3 p-2 bg-zinc-700 hover:bg-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          title="Refresh data"
        >
          {/* <span>Refresh:</span> */}
          <RefreshCw
            className={`w-5 h-5 text-zinc-400 ${
              isRefreshing || isLoading ? 'animate-spin' : ''
            } transition-transform duration-200 hover:text-zinc-300`}
          />
        </button>
      </div>
      <Table className="rounded-none">
        <TableHeader>
          <TableRow className="border-zinc-400">
            <TableHead className="text-zinc-400"></TableHead>
            <TableHead className="text-zinc-400">Name</TableHead>
            <TableHead className="text-zinc-400">Mail</TableHead>
            <TableHead className="text-zinc-400">Type</TableHead>
            <TableHead className="text-zinc-400 text-center">
              Deal Invested
            </TableHead>
            <TableHead className="text-zinc-400">KYC Status</TableHead>
            <TableHead className="text-zinc-400">Joining Date</TableHead>
            <TableHead className="text-zinc-400">MCA</TableHead>
            <TableHead className="text-zinc-400"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.investors &&
            data?.investors?.map(investor => (
              <TableRow className="border-[#2A2A2B]" key={investor.investor_id}>
                <TableCell className="font-medium">
                  <Switch />
                </TableCell>
                <TableCell className="font-medium flex items-center">
                  <div className="w-5 h-5 mr-2 overflow-hidden rounded-full">
                    <img
                      src={investor.profile_pic}
                      className="w-full h-full object-cover"
                      alt="dp"
                    />
                  </div>
                  {investor.name}
                </TableCell>
                <TableCell className="font-medium">{investor.mail}</TableCell>
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
                  {/* {investor.mca_key} */}
                  <FileText />
                </TableCell>
                <TableCell className="font-medium">
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <MoreHorizontal className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="rounded-none">
                      <DropdownMenuItem
                      // onClick={() => handleEditMember(investor.investor_id)}
                      >
                        <Pencil />
                        Edit Member
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-400"
                        // onClick={() => handleDeleteMember(investor.investor_id)}
                      >
                        <Trash2 className="text-red-400" />
                        Delete Member
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      <Pagination className="bg-[#2A2A2B] p-2 flex justify-between items-center">
        <span>Total records: {data?.pagination.total_records}</span>
        <PaginationContent className="gap-10">
          <PaginationItem>
            <PaginationPrevious
              className="rounded-none"
              onClick={handlePrev}
              aria-disabled={!pagination?.has_prev}
            />
          </PaginationItem>
          <div className="flex gap-2">
            {Array.from({ length: pagination?.total_pages || 1 }, (_, idx) => (
              <PaginationItem key={idx + 1}>
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
          <PaginationItem>
            <PaginationNext
              className="rounded-none"
              onClick={handleNext}
              aria-disabled={!pagination?.has_next}
            />
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
                <SelectItem value={String(ps)}>{ps}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Pagination>
    </div>
  );
};

export default InvestorTable;

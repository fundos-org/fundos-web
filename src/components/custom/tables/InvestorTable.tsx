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
import { FileText, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
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

const InvestorTable = () => {
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize] = useState<number>(10);
  const { data, isLoading, error } = useInvestors(pageNumber, pageSize);
  console.log('Investors API data:', data, error);

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

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-zinc-400"></TableHead>
            <TableHead className="text-zinc-400">Name</TableHead>
            <TableHead className="text-zinc-400">Mail</TableHead>
            <TableHead className="text-zinc-400">Type</TableHead>
            <TableHead className="text-zinc-400  text-center">
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
              <TableRow key={investor.investor_id}>
                <TableCell className="font-medium">
                  <Switch />
                </TableCell>
                <TableCell className="font-medium">{investor.name}</TableCell>
                <TableCell className="font-medium">{investor.mail}</TableCell>
                {/* <TableCell className="font-medium">
                  {investor.profile_pic}
                </TableCell> */}
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
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={handlePrev}
              aria-disabled={!pagination?.has_prev}
            />
          </PaginationItem>
          {Array.from({ length: pagination?.total_pages || 1 }, (_, idx) => (
            <PaginationItem key={idx + 1}>
              <PaginationLink
                className={`${pageNumber === idx + 1 ? 'text-black' : 'text-white'}`}
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
          <PaginationItem>
            <PaginationNext
              onClick={handleNext}
              aria-disabled={!pagination?.has_next}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </>
  );
};

export default InvestorTable;

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { formatEnumToText } from '@/lib/formatUtils';
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
import SubadminIdsSelect from '../CustomSelects/SubadminIdsSelect';
import FilterSelect from '../CustomSelects/FilterSelect';
import {
  InvestorType,
  KycStatus,
  OnboardingStatus,
} from '@/constants/investorsConstant';
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
  subadmin_id?: string;
}

const sessCapture = () => {
  const subadminDetailsRaw = sessionStorage.getItem(AppEnums.SUBADMIN_SESSION);
  const { subadmin_id } = subadminDetailsRaw
    ? JSON.parse(subadminDetailsRaw)
    : {};
  return subadmin_id;
};

const pageSizesList = [10, 20, 50, 100];

const InvestorTable: FC<{ isSubadmin: boolean }> = ({ isSubadmin }) => {
  const [investor, setInvestor] = useState<InvestorEntity | null>();
  const [editUser, setEditUser] = useState<OpenEditDialog | null>(null);
  const [investor_type, setInvestorType] = useState<InvestorType | undefined>();
  const [onboarding_status, setOnboardingStatus] = useState<
    OnboardingStatus | undefined
  >();
  const [kyc_status, setKycStatus] = useState<KycStatus | undefined>();
  const [awsObjectKey, setAwsObjectKey] = useState<string | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [subAdminId, setSubAdminId] = useState<string | undefined>(sessCapture);
  const { data: subadminIds } = useSubadminIds(isSubadmin);
  const { mutate: deleteInvestor } = useInvestorDelete();
  const {
    data,
    isLoading: isFetching,
    error,
    refetch,
  } = useInvestors({
    pageNumber,
    pageSize,
    subAdminId,
    isSubadmin,
    investor_type,
    onboarding_status,
    kyc_status,
  });

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

  const handleSubAdminIdChange = (id: string) => {
    setSubAdminId(id);
    sessionStorage.setItem(AppEnums.CAPDRPDWNCHGE, id);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
    } finally {
      setTimeout(() => setIsRefreshing(false), 500); // Small delay for better UX
    }
  };

  const clearFilters = () => {
    setInvestorType(undefined);
    setOnboardingStatus(undefined);
    setKycStatus(undefined);
  };

  return (
    <>
      <div className="w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="flex justify-between items-center py-4 bg-gray-50 px-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Onboarded Investors</h2>
          </div>
          <div className="flex items-center gap-3">
            {!isSubadmin && (
              <SubadminIdsSelect
                list={subadminIds?.subadmins ?? []}
                handleChange={handleSubAdminIdChange}
                value={subAdminId ?? ''}
                isItForDeals={false}
              />
            )}
            <Button
              onClick={clearFilters}
              className="border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 rounded-lg px-4 py-2 transition-colors"
              title="Clear all filters"
            >
              Clear Filters
            </Button>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={handleRefresh}
                  disabled={isRefreshing || isFetching}
                  className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  title="Refresh data"
                >
                  <RefreshCw
                    className={`w-5 h-5 text-gray-600 ${
                      isRefreshing || isFetching ? 'animate-spin' : ''
                    }`}
                  />
                </button>
              </TooltipTrigger>
              <TooltipContent className="bg-white border border-gray-200 rounded-lg">
                <strong>Refresh to get Fresh Data</strong>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
        <div className="grid w-full [&>div]:min-h-[56vh] [&>div]:border-0 custom-scrollbar-table">
          <Table className="rounded-none">
            <TableHeader>
              <TableRow className="[&>*]:whitespace-nowrap sticky bg-gray-50 z-2 top-0 border-b border-gray-200 hover:bg-gray-50">
                <TableHead className="font-semibold text-gray-900 pl-4">Action</TableHead>
                <TableHead className="font-semibold text-gray-900">Name</TableHead>
                <TableHead className="font-semibold text-gray-900">Mail</TableHead>
                <TableHead className="font-semibold text-gray-900">
                  <FilterSelect
                    enumObject={InvestorType}
                    handleChange={value =>
                      setInvestorType(value as InvestorType)
                    }
                    value={investor_type ?? ''}
                    placeholder="Investor Type"
                  />
                </TableHead>
                <TableHead className="font-semibold text-gray-900">
                  <FilterSelect
                    enumObject={OnboardingStatus}
                    handleChange={value =>
                      setOnboardingStatus(value as OnboardingStatus)
                    }
                    value={onboarding_status ?? ''}
                    placeholder="Onboarding Status"
                  />
                </TableHead>
                <TableHead className="font-semibold text-gray-900 text-center">
                  Deal Invested
                </TableHead>
                <TableHead className="font-semibold text-gray-900">
                  <FilterSelect
                    enumObject={KycStatus}
                    handleChange={value => setKycStatus(value as KycStatus)}
                    value={kyc_status ?? ''}
                    placeholder="KYC Status"
                  />
                </TableHead>
                <TableHead className="font-semibold text-gray-900">Joining Date</TableHead>
                <TableHead className="font-semibold text-gray-900">
                  Capital Commit(INR)
                </TableHead>
                <TableHead className="font-semibold text-gray-900">MCA</TableHead>
                {isSubadmin && (
                  <TableHead className="font-semibold text-gray-900">Edit</TableHead>
                )}
                {isSubadmin && (
                  <TableHead className="font-semibold text-gray-900">Bin</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody className="overflow-hidden">
              {data?.investors && data.investors.length > 0 ? (
                data.investors.map((investor: InvestorEntity) => (
                  <TableRow
                    className="border-b border-gray-200 hover:bg-gray-50 [&>*]:whitespace-nowrap"
                    key={investor.investor_id}
                  >
                    <TableCell className="font-medium pl-4">
                      <SwitchCustom />
                    </TableCell>
                    <TableCell
                      className="font-medium flex items-center py-2 cursor-pointer hover:underline"
                      onClick={() => setInvestor(investor)}
                    >
                      <div className="w-5 h-5 mr-2 mt-2 overflow-hidden rounded-full">
                        <img
                          src={investor?.profile_pic}
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
                    <TableCell className="font-medium text-center">
                      {formatEnumToText(investor.type)}
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatEnumToText(investor.onboarding_status)}
                    </TableCell>
                    <TableCell className="font-medium text-center">
                      {investor.deals_invested}
                    </TableCell>
                    <TableCell className="font-medium text-center">
                      {formatEnumToText(investor.kyc_status)}
                    </TableCell>
                    <TableCell className="font-medium">
                      {investor.joined_on}
                    </TableCell>
                    <TableCell className="font-medium text-center">
                      {investor.capital_commitment}
                    </TableCell>
                    <TableCell className="font-medium">
                      <FileText
                        onClick={() => setAwsObjectKey(investor.mca_key)}
                        className="cursor-pointer"
                      />
                    </TableCell>
                    {isSubadmin && (
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
                    {isSubadmin && (
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
                ))
              ) : (
                <TableRow className="h-100 hover:bg-gray-50">
                  <TableCell
                    colSpan={isSubadmin ? 12 : 10}
                    className="text-center py-8 text-gray-500"
                  >
                    No investor found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <Pagination className="bg-gray-50 border-t border-gray-200 p-4 flex justify-between items-center">
          <span className="text-sm text-gray-600">Total records: {data?.pagination.total_records}</span>
          <PaginationContent className="gap-2">
            <PaginationItem
              className={`${!pagination?.has_prev ? 'hidden' : null} cursor-pointer`}
            >
              <PaginationPrevious
                className="border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 rounded-lg"
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
                      className={`border border-gray-300 rounded-lg ${
                        pageNumber === idx + 1 
                          ? 'bg-blue-600 text-white border-blue-600' 
                          : 'bg-white text-gray-700 hover:bg-gray-50'
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
              className={`${!pagination?.has_next ? 'hidden' : null} cursor-pointer`}
            >
              <PaginationNext 
                className="border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 rounded-lg" 
                onClick={handleNext} 
              />
            </PaginationItem>
          </PaginationContent>
          <div className="flex items-center gap-2">
            <label htmlFor="pageSizeSelect" className="text-sm font-medium text-gray-600">
              Records per page:
            </label>
            <Select
              onValueChange={handlePageSizeChange}
              defaultValue={String(pageSize)}
            >
              <SelectTrigger className="border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 rounded-lg w-[100px]">
                <SelectValue placeholder="Select Page Size" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 rounded-lg shadow-lg">
                {pageSizesList.map(ps => (
                  <SelectItem 
                    key={ps} 
                    value={String(ps)}
                    className="cursor-pointer hover:bg-gray-50 text-gray-900"
                  >
                    {ps}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </Pagination>
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <InvestorDetailsDialog investor={investor} setInvestor={setInvestor} />
      </Suspense>
      <Suspense fallback={<div className="spinner">Loading...</div>}>
        <InvestorEditDialog
          editDetailsOpen={editUser}
          setEditDetailsOpen={setEditUser}
        />
      </Suspense>
      <Suspense fallback={<div>Loading...</div>}>
        <InvestorFileDisplayDialog
          awsObjectKey={awsObjectKey}
          setAwsObjectKey={setAwsObjectKey}
        />
      </Suspense>
    </>
  );
};

export default InvestorTable;

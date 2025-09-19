import { FC, useState } from 'react';
import { useInvestorDealInvestments } from '@/hooks/customhooks/MembersHooks/useInvestorDealInvestments';
import CardDeal from './Deal';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
const pageSizesList = [3, 6, 9, 18, 50];

const InvestorInvestments: FC<{ investor_id: string }> = ({ investor_id }) => {
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(3);
  const { data } = useInvestorDealInvestments(
    pageNumber,
    pageSize,
    investor_id
  );
  const handlePrev = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    if (data?.pagination?.has_prev && pageNumber > 1) {
      setPageNumber(prev => prev - 1);
    }
  };

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
  return (
    <div className="w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="flex justify-between items-center py-4 bg-gray-50 px-6 border-b border-gray-200">
        <h1 className="text-xl font-semibold text-gray-900">
          Investor Investments
        </h1>
      </div>
      
      <div className="p-6">
        {data?.deals && data.deals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.deals.map((deal, index) => <CardDeal key={`${deal.company_name}-${index}`} deal={deal} />)}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <span className="text-sm">This investor has no investments yet.</span>
          </div>
        )}
      </div>
      
      {(data?.deals?.length ?? 0) > 0 && (
        <div className="flex items-center justify-between bg-white p-4 border-t border-gray-200">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">{(pageNumber - 1) * pageSize + 1}</span> to{' '}
            <span className="font-medium">
              {Math.min(pageNumber * pageSize, data?.pagination?.total_records || 0)}
            </span>{' '}
            of <span className="font-medium">{data?.pagination?.total_records || 0}</span> results
          </div>
          <Pagination className="flex items-center gap-2">
            <PaginationContent className="flex items-center gap-2">
            <PaginationItem
              className={`${!data?.pagination?.has_prev ? 'hidden' : null} cursor-pointer`}
            >
              <PaginationPrevious
                className="rounded-lg hover:bg-gray-50"
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
                      className={`rounded-lg hover:bg-gray-50 ${pageNumber === idx + 1 ? 'bg-blue-600 text-white hover:bg-blue-700' : 'text-gray-700'}`}
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
              <PaginationNext className="rounded-lg hover:bg-gray-50" onClick={handleNext} />
            </PaginationItem>
          </PaginationContent>
          <div className="flex items-center gap-2">
            <label htmlFor="pageSizeSelect" className="text-sm font-medium text-gray-700">
              Records per page:
            </label>
            <Select
              onValueChange={handlePageSizeChange}
              defaultValue={String(pageSize)}
            >
              <SelectTrigger className="w-20 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg">
                <SelectValue placeholder="Select Page Size" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200 rounded-lg">
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
      )}
    </div>
  );
};
export default InvestorInvestments;

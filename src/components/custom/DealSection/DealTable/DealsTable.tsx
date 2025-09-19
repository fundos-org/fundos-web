import { Dispatch, FC, lazy, SetStateAction } from 'react';
import { DealCard as DC } from '@/constants/dealsConstant';
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
import { Pagination as IPagination } from '@/constants/dealsConstant';

const Dealcard = lazy(() => import('./DealCard'));

const pageSizesList = [3, 6, 9, 18, 50];

const DealsTable: FC<{
  deals: DC[];
  pageNumber: number;
  pageSize: number;
  setPageNumber: Dispatch<SetStateAction<number>>;
  setPageSize: Dispatch<SetStateAction<number>>;
  pagination: IPagination;
}> = ({
  deals,
  pageNumber,
  pageSize,
  setPageNumber,
  setPageSize,
  pagination,
}) => {
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
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {deals?.map((deal: DC) => <Dealcard deal={deal} key={deal.deal_id} />)}
      </div>
      {deals.length > 0 && (
        <Pagination className="bg-white border border-gray-200 rounded-lg p-4 flex justify-between items-center mt-6">
          <span className="text-sm font-medium text-gray-700">
            Total records: <span className="font-semibold text-gray-900">{pagination.total_records}</span>
          </span>
          <PaginationContent className="gap-2">
            <PaginationItem
              className={`${!pagination?.has_prev ? 'opacity-50' : 'cursor-pointer'}`}
            >
              <PaginationPrevious
                className="rounded-lg hover:bg-gray-50"
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
                      className={`rounded-lg hover:bg-gray-50 ${
                        pageNumber === idx + 1 
                          ? 'bg-blue-600 text-white hover:bg-blue-700' 
                          : 'text-gray-700 hover:text-gray-900'
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
              className={`${!pagination?.has_next ? 'opacity-50' : 'cursor-pointer'}`}
            >
              <PaginationNext className="rounded-lg hover:bg-gray-50" onClick={handleNext} />
            </PaginationItem>
          </PaginationContent>
          <div className="flex items-center gap-2">
            <label htmlFor="pageSizeSelect" className="text-sm font-medium text-gray-700">
              Show:
            </label>
            <Select
              onValueChange={handlePageSizeChange}
              defaultValue={String(pageSize)}
            >
              <SelectTrigger className="w-20 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg">
                <SelectValue />
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
      )}
    </div>
  );
};

export default DealsTable;

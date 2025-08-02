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
    <>
      <div className="flex flex-wrap gap-4 overflow-y-auto custom-scrollbar-table w-full">
        {data?.deals?.map(deal => <CardDeal deal={deal} />)}
      </div>
      {(data?.deals?.length ?? 0) > 0 && (
        <Pagination className="bg-[#2A2A2B] p-2 flex justify-between items-center">
          <span>Total records: {data?.pagination?.total_records}</span>
          <PaginationContent className="gap-10">
            <PaginationItem
              className={`${!data?.pagination?.has_prev ? 'hidden' : null} cursor-pointer`}
            >
              <PaginationPrevious
                className="rounded-none"
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
              className={`${!data?.pagination?.has_next ? 'hidden' : null} cursor-pointer`}
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
      )}
    </>
  );
};
export default InvestorInvestments;

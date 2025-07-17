import { getDealTransactions } from '@/axioscalls/apiServices';
import { QueryEnums } from '@/queryEnums';
import toast from 'react-hot-toast';
import { useQuery } from 'react-query';

export const useDealTransactions = (
  deal_id: string,
  pageNumber: number,
  pageSize: number
) => {
  return useQuery(
    [QueryEnums.DealTransactions, deal_id, pageNumber, pageSize],
    () => getDealTransactions(deal_id, pageNumber, pageSize),
    {
      enabled: !!deal_id,
      refetchOnWindowFocus: false,
      retry: 2,
      keepPreviousData: true, // useful for pagination
      // staleTime: 1000 * 60 * 60, // 1 hour
      onSuccess: () => toast.success('Deal Transactions fetched successfully'),
      onError: (error: Error) => {
        toast.error(`Fetch deals failed: ${error.message}`);
      },
    }
  );
};

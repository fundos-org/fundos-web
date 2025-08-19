import { getDealInvestorCommitments } from '@/axioscalls/apiServices';
import { QueryEnums } from '@/queryEnums';
import toast from 'react-hot-toast';
import { useQuery, useQueryClient } from 'react-query';

export const useDealInvestorCommitments = (
  deal_id: string,
  pageNumber: number,
  pageSize: number
) => {
  const queryClient = useQueryClient();
  return useQuery(
    [QueryEnums.DealInvestorsCommitments, deal_id, pageNumber, pageSize],
    () => getDealInvestorCommitments(deal_id, pageNumber, pageSize),
    {
      enabled: !!deal_id,
      refetchOnWindowFocus: false,
      retry: 2,
      keepPreviousData: true, // useful for pagination
      // staleTime: 1000 * 60 * 60, // 1 hour
      onSuccess: () => {
        const queryKey = [
          QueryEnums.DealInvestorsCommitments,
          deal_id,
          pageNumber,
          pageSize,
        ];
        const queryState = queryClient.getQueryState(queryKey);

        if (queryState) {
          // Check if the data is fresh (not from cache) using dataUpdatedAt
          const isFresh = queryState.dataUpdatedAt > Date.now() - 1000; // 1 second threshold
          if (isFresh) toast.success('Deals Investments fetched successfully');
        }
      },
      onError: (error: Error) => {
        toast.error(`Fetch investors failed: ${error.message}`);
      },
    }
  );
};

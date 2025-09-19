import { getDealInvestorInvestments } from '@/axioscalls/apiServices';
import { QueryEnums } from '@/queryEnums';
import { useQuery, useQueryClient } from 'react-query';
import { useNotification } from '@/components/custom/NotificationProvider';

export const useDealInvestorInvestments = (
  deal_id: string,
  pageNumber: number,
  pageSize: number
) => {
  const queryClient = useQueryClient();
  const notification = useNotification();
  
  return useQuery(
    [QueryEnums.DealInvestorsInvestments, deal_id, pageNumber, pageSize],
    () => getDealInvestorInvestments(deal_id, pageNumber, pageSize),
    {
      enabled: !!deal_id,
      refetchOnWindowFocus: false,
      retry: 2,
      keepPreviousData: true, // useful for pagination
      // staleTime: 1000 * 60 * 60, // 1 hour
      onSuccess: () => {
        const queryKey = [
          QueryEnums.DealInvestorsInvestments,
          deal_id,
          pageNumber,
          pageSize,
        ];
        const queryState = queryClient.getQueryState(queryKey);

        if (queryState) {
          // Check if the data is fresh (not from cache) using dataUpdatedAt
          const isFresh = queryState.dataUpdatedAt > Date.now() - 1000; // 1 second threshold
          if (isFresh) {
            notification.success('Deal Investments Loaded', 'Successfully fetched deal investments');
          }
        }
      },
      onError: (error: Error) => {
        notification.error('Failed to Load Deal Investments', error.message || 'Unable to fetch deal investments. Please try again.');
      },
    }
  );
};

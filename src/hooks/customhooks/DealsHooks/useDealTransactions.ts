import { getDealTransactions } from '@/axioscalls/apiServices';
import { QueryEnums } from '@/queryEnums';
import { useQuery } from 'react-query';
import { useNotification } from '@/components/custom/NotificationProvider';

export const useDealTransactions = (
  deal_id: string,
  pageNumber: number,
  pageSize: number
) => {
  const notification = useNotification();

  return useQuery(
    [QueryEnums.DealTransactions, deal_id, pageNumber, pageSize],
    () => getDealTransactions(deal_id, pageNumber, pageSize),
    {
      enabled: !!deal_id,
      refetchOnWindowFocus: false,
      retry: 2,
      keepPreviousData: true, // useful for pagination
      staleTime: 1000 * 60 * 60, // 1 hour
      onSuccess: (data) => {
        if (data?.transactions?.length > 0) {
          notification.success(
            'Deal Transactions Loaded',
            `Successfully loaded ${data.transactions.length} transactions`,
            { duration: 3000 }
          );
        }
      },
      onError: (error: Error) => {
        notification.error(
          'Failed to Load Transactions',
          error.message || 'Unable to fetch deal transactions. Please try again.',
          { duration: 5000 }
        );
      },
    }
  );
};

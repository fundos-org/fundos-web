import { analyticsApi } from '@/axioscalls/analyticsApi';
import { QueryEnums } from '@/queryEnums';
import { useQuery } from 'react-query';
import { useNotification } from '@/components/custom/NotificationProvider';

export const useSubadminTransactions = (
  pageNumber: number = 1,
  pageSize: number = 10,
  enabled: boolean = true
) => {
  const notification = useNotification();

  return useQuery(
    [QueryEnums.SubadminTransactions, pageNumber, pageSize],
    () => analyticsApi.getAllTransactions({ 
      page: pageNumber, 
      per_page: pageSize 
    }),
    {
      enabled,
      refetchOnWindowFocus: false,
      retry: 2,
      keepPreviousData: true, // useful for pagination
      staleTime: 1000 * 60 * 5, // 5 minutes
      onSuccess: (data) => {
        if (data?.data?.length > 0) {
          notification.success(
            'Transactions Loaded',
            `Successfully loaded ${data.data.length} recent transactions`,
            { duration: 3000 }
          );
        }
      },
      onError: (error: Error) => {
        notification.error(
          'Failed to Load Transactions',
          error.message || 'Unable to fetch recent transactions. Please try again.',
          { duration: 5000 }
        );
      },
    }
  );
};


import { getAdminOverview } from '@/axioscalls/apiServices';
import { QueryEnums } from '@/queryEnums';
import { useQuery, useQueryClient } from 'react-query';
import { useNotification } from '@/components/custom/NotificationProvider';

export const useAdminOverviewTable = (pageNumber: number, pageSize: number) => {
  const queryClient = useQueryClient();
  const notification = useNotification();

  return useQuery(
    [QueryEnums.AdminOverview, pageNumber, pageSize],
    () => getAdminOverview(pageNumber, pageSize),
    {
      refetchOnWindowFocus: false,
      retry: 2,
      keepPreviousData: true, // useful for pagination
      staleTime: 1000 * 60 * 60, // 1 hour
      onSuccess: (data) => {
        const queryKey = [QueryEnums.AdminOverview, pageNumber, pageSize];
        const queryState = queryClient.getQueryState(queryKey);

        if (queryState && data?.subadmins?.length > 0) {
          // Check if the data is fresh (not from cache) using dataUpdatedAt
          const isFresh = queryState.dataUpdatedAt > Date.now() - 1000; // 1 second threshold
          if (isFresh) {
            notification.success(
              'Subadmin Overview Loaded',
              `Successfully loaded ${data.subadmins.length} subadmin records`,
              { duration: 3000 }
            );
          }
        }
      },
      onError: (error: Error) => {
        notification.error(
          'Failed to Load Overview',
          error.message || 'Unable to fetch subadmin overview. Please try again.',
          { duration: 5000 }
        );
      },
    }
  );
};

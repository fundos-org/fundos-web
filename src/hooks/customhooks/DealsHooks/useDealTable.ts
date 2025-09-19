import { getDeals } from '@/axioscalls/apiServices';
import { QueryEnums } from '@/queryEnums';
import { QueryClient, useQuery } from 'react-query';
import { useNotification } from '@/components/custom/NotificationProvider';

const queryClient = new QueryClient();

export const useDealTable = (
  activePageNumber: number = 1,
  activePageSize: number = 3,
  closedPageNumber: number = 1,
  closedPageSize: number = 3,
  onholdPageNumber: number = 1,
  onholdPageSize: number = 3,
  subadmin_id?: string
) => {
  const notification = useNotification();

  return useQuery(
    [
      QueryEnums.Deals,
      subadmin_id,
      activePageNumber,
      activePageSize,
      closedPageNumber,
      closedPageSize,
      onholdPageNumber,
      onholdPageSize,
    ],
    () =>
      getDeals(
        activePageNumber,
        activePageSize,
        closedPageNumber,
        closedPageSize,
        onholdPageNumber,
        onholdPageSize,
        subadmin_id!
      ),
    {
      enabled: !!subadmin_id,
      refetchOnWindowFocus: false,
      retry: 2,
      keepPreviousData: true, // useful for pagination
      // staleTime: 1000 * 60 * 60, // 1 hour - Removed to ensure data loads on first visit
      onSuccess: () => {
        // Only show notification for manual refresh, not initial load
        // The notification will be handled by the refresh button action
      },
      onError: (error: Error) => {
        notification.error(
          'Failed to Load Deals',
          error.message || 'Unable to fetch deals. Please try again.',
          { duration: 5000 }
        );
      },
    }
  );
};

export const invalidateDealsTableQuery = () => {
  queryClient.invalidateQueries({
    queryKey: [QueryEnums.Deals],
  });
};

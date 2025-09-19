//useSubadminDashboardMetadata
import { fetchDashboardStatistics } from '@/axioscalls/apiServices';
import { QueryEnums } from '@/queryEnums';
import { useQuery } from 'react-query';
import { useNotification } from '@/components/custom/NotificationProvider';

export const useSubadminDashboardMetadata = (isSubadmin?: boolean) => {
  const notification = useNotification();

  return useQuery(
    [QueryEnums.SubadminDashboardMetadata],
    fetchDashboardStatistics,
    {
      enabled: isSubadmin,
      refetchOnWindowFocus: false,
      retry: 2,
      keepPreviousData: true, // useful for pagination
      staleTime: 1000 * 60 * 60 * 6, // 6 hours
      onSuccess: (data) => {
        if (data) {
          notification.success(
            'Dashboard Data Loaded',
            'Successfully loaded dashboard statistics',
            { duration: 3000 }
          );
        }
      },
      onError: () => {
        notification.error(
          'Failed to Load Dashboard',
          'Unable to fetch dashboard statistics. Please try again.',
          { duration: 5000 }
        );
      },
    }
  );
};

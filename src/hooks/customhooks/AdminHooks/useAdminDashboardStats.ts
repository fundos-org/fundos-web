import { getAdminDashboardStats } from '@/axioscalls/apiServices';
import { QueryEnums } from '@/queryEnums';
import { useQuery } from 'react-query';
import { useNotification } from '@/components/custom/NotificationProvider';

export const useAdminDashboardStats = () => {
  const notification = useNotification();

  return useQuery([QueryEnums.AdminMetadata], () => getAdminDashboardStats(), {
    refetchOnWindowFocus: false,
    retry: 2,
    keepPreviousData: true, // useful for pagination
    staleTime: 1000 * 60 * 60 * 6, // 6 hours
    onSuccess: (data) => {
      if (data) {
        notification.success(
          'Dashboard Data Loaded',
          'Successfully loaded admin dashboard statistics',
          { duration: 3000 }
        );
      }
    },
    onError: (error: Error) => {
      notification.error(
        'Failed to Load Dashboard',
        error.message || 'Unable to fetch admin dashboard statistics. Please try again.',
        { duration: 5000 }
      );
    },
  });
};

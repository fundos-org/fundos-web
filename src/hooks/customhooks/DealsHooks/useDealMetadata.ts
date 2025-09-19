//fetchDealStatistics
import { fetchDealStatistics } from '@/axioscalls/apiServices';
import { QueryEnums } from '@/queryEnums';
import { useQuery } from 'react-query';
import { useNotification } from '@/components/custom/NotificationProvider';

export const useDealMetadata = (isSubadmin: boolean | undefined) => {
  const notification = useNotification();

  return useQuery([QueryEnums.DealMetadata], () => fetchDealStatistics(), {
    enabled: isSubadmin,
    refetchOnWindowFocus: false,
    retry: 2,
    keepPreviousData: true, // useful for pagination
    // staleTime: 1000 * 60 * 60, // 1 hour
    onSuccess: () => notification.success('Deal Statistics Loaded', 'Successfully fetched deal statistics'),
    onError: (error: Error) => {
      notification.error('Failed to Load Deal Statistics', error.message || 'Unable to fetch deal statistics. Please try again.');
    },
  });
};

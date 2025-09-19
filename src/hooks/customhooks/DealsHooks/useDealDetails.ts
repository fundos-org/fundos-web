import { getDealDetails } from '@/axioscalls/apiServices';
import { QueryEnums } from '@/queryEnums';
import { useQuery } from 'react-query';
import { useNotification } from '@/components/custom/NotificationProvider';

export const useDealDetails = (deal_id: string | null) => {
  const notification = useNotification();

  return useQuery(
    [QueryEnums.DealDetails, deal_id],
    () => getDealDetails(deal_id!),
    {
      enabled: !!deal_id,
      refetchOnWindowFocus: false,
      retry: 2,
      keepPreviousData: true, // useful for pagination
      // staleTime: 1000 * 60 * 60, // 1 hour
      onSuccess: () => notification.success('Deal Details Loaded', 'Successfully fetched deal details'),
      onError: (error: Error) => {
        notification.error('Failed to Load Deal Details', error.message || 'Unable to fetch deal details. Please try again.');
      },
    }
  );
};

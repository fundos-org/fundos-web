import { getDealDocuments } from '@/axioscalls/apiServices';
import { QueryEnums } from '@/queryEnums';
import { useQuery } from 'react-query';
import { useNotification } from '@/components/custom/NotificationProvider';

export const useDealDocuments = (deal_id: string) => {
  const notification = useNotification();

  return useQuery(
    [QueryEnums.DealDocuments, deal_id],
    () => getDealDocuments(deal_id),
    {
      enabled: !!deal_id,
      refetchOnWindowFocus: false,
      retry: 2,
      keepPreviousData: true, // useful for pagination
      //   staleTime: 1000 * 60 * 60, // 1 hour
      onSuccess: (data) => notification.success('Deal Documents Loaded', `Successfully fetched ${Array.isArray(data?.documents) ? data.documents.length : 0} documents`),
      onError: (error: Error) => {
        notification.error('Failed to Load Deal Documents', error.message || 'Unable to fetch deal documents. Please try again.');
      },
    }
  );
};

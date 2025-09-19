import { getDealInvestorCommitments } from '@/axioscalls/apiServices';
import { QueryEnums } from '@/queryEnums';
import { useQuery } from 'react-query';
import { useNotification } from '@/components/custom/NotificationProvider';

export const useDealInvestorCommitments = (
  deal_id: string,
  pageNumber: number,
  pageSize: number
) => {
  const notification = useNotification();

  return useQuery(
    [QueryEnums.DealInvestorsCommitments, deal_id, pageNumber, pageSize],
    () => getDealInvestorCommitments(deal_id, pageNumber, pageSize),
    {
      enabled: !!deal_id,
      refetchOnWindowFocus: false,
      retry: 2,
      keepPreviousData: true, // useful for pagination
      // staleTime: 1000 * 60 * 60, // 1 hour - Removed to ensure fresh data loading
      onSuccess: () => {
        // Only show notification for manual refresh, not automatic loading
        // The notification will be handled by the refresh button action
      },
      onError: (error: Error) => {
        notification.error(
          'Failed to Load Commitments',
          error.message || 'Unable to fetch investor commitments. Please try again.',
          { duration: 5000 }
        );
      },
    }
  );
};

import { markDealInactive } from '@/axioscalls/apiServices';
import { QueryEnums } from '@/queryEnums';
import { useNotification } from '@/components/custom/NotificationProvider';
import { useMutation, useQueryClient } from 'react-query';

export const useDealInactive = () => {
  const queryClient = useQueryClient();
  const notification = useNotification();
  return useMutation({
    mutationFn: (deal_id: string) => {
      return markDealInactive(deal_id);
    },
    onSuccess: (_, deal_id) => {
      notification.success('Deal Inactive', 'Deal marked as inactive successfully');
      queryClient.invalidateQueries({
        queryKey: [QueryEnums.Deals],
      });
      queryClient.removeQueries({
        queryKey: [QueryEnums.Deals, deal_id],
      });
    },
    onError: (error: Error) => {
      notification.error('Mark Inactive Failed', `Unable to mark this deal: ${error.message}`);
    },
  });
};

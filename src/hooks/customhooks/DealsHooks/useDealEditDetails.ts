import { Files, updateDealDetails } from '@/axioscalls/apiServices';
import { DealDetails } from '@/constants/dealsConstant';
import { QueryEnums } from '@/queryEnums';
import { useNotification } from '@/components/custom/NotificationProvider';
import { useMutation, useQueryClient } from 'react-query';

export const useDealEditDetails = (deal_id: string | null) => {
  const queryClient = useQueryClient();
  const notification = useNotification();

  return useMutation({
    mutationFn: (details: Partial<DealDetails>, files?: Partial<Files>) =>
      updateDealDetails(deal_id!, details, files),
    onSuccess: _ => {
      notification.success('Deal Updated', 'Deal details updated successfully');
      queryClient.invalidateQueries({
        queryKey: [QueryEnums.DealDetails, deal_id],
      });
      queryClient.invalidateQueries({
        queryKey: [QueryEnums.DealDetails, deal_id],
      });
      queryClient.invalidateQueries({
        queryKey: [QueryEnums.Deals],
      });
      queryClient.invalidateQueries({
        queryKey: [QueryEnums.Deals],
        exact: false,
      });
    },
    onError: (error: Error) => {
      notification.error('Update Failed', error.message || 'Failed updating details.');
    },
  });
};

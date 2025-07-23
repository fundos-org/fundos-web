import { updateDealDetails } from '@/axioscalls/apiServices';
import { DealDetails } from '@/constants/dealsConstant';
import { QueryEnums } from '@/queryEnums';
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from 'react-query';

export const useDealEditDetails = (deal_id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (details: Partial<DealDetails>) =>
      updateDealDetails(deal_id, details),
    onSuccess: response => {
      toast.success(response?.message && 'Deal Details updated successfully');
      queryClient.invalidateQueries({
        queryKey: [QueryEnums.DealDetails, deal_id],
      });
      queryClient.removeQueries({
        queryKey: [QueryEnums.DealDetails, deal_id],
      });
      queryClient.invalidateQueries({
        queryKey: [QueryEnums.DealDetails, deal_id],
        exact: false,
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed updating details.');
    },
  });
};

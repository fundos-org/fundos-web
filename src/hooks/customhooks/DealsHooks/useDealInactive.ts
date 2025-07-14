import { markDealInactive } from '@/axioscalls/apiServices';
import { QueryEnums } from '@/queryEnums';
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from 'react-query';

export const useDealInactive = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (deal_id: string) => {
      return markDealInactive(deal_id);
    },
    onSuccess: (response, deal_id) => {
      toast.success(response?.message && 'Deal Made Inactive successfully');
      queryClient.invalidateQueries({
        queryKey: [QueryEnums.Deals],
      });
      queryClient.removeQueries({
        queryKey: [QueryEnums.Deals, deal_id],
      });
    },
    onError: (error: Error) => {
      toast.error(`Delete investor failed: ${error.message}`);
    },
  });
};

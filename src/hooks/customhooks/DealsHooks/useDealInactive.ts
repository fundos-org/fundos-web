import { markDealInactive } from '@/axioscalls/apiServices';
// import { QueryEnums } from '@/queryEnums';
import toast from 'react-hot-toast';
import { useMutation } from 'react-query';

export const useDealInactive = () => {
  //   const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (deal_id: string) => {
      return markDealInactive(deal_id);
    },
    onSuccess: response => {
      toast.success(response?.message && 'Investors fetched successfully');
      //   queryClient.invalidateQueries({
      //     queryKey: [QueryEnums.Deals],
      //   });
      //   queryClient.removeQueries({
      //     queryKey: [QueryEnums.Deals, deal_id],
      //   });
    },
    onError: (error: Error) => {
      toast.error(`Delete investor failed: ${error.message}`);
    },
  });
};

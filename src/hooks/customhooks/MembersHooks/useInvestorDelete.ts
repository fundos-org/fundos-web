import { deleteInvestor } from '@/axioscalls/apiServices';
import { QueryEnums } from '@/queryEnums';
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from 'react-query';

export const useInvestorDelete = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (investor_id: string) => {
      return deleteInvestor(investor_id);
    },
    onSuccess: (response, investor_id) => {
      toast.success(response?.message && 'Investors fetched successfully');
      queryClient.invalidateQueries({
        queryKey: [QueryEnums.Investors],
      });
      queryClient.removeQueries({
        queryKey: [QueryEnums.Investors, investor_id],
      });
    },
    onError: (error: Error) => {
      toast.error(`Delete investor failed: ${error.message}`);
    },
  });
};

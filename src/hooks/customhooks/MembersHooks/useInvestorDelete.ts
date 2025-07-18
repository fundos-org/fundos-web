import { deleteInvestor } from '@/axioscalls/apiServices';
import { QueryEnums } from '@/queryEnums';
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from 'react-query';

interface OpenEditDialog {
  investor_id: string;
  subadmin_id: string;
}

export const useInvestorDelete = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ subadmin_id, investor_id }: OpenEditDialog) => {
      return deleteInvestor(subadmin_id, investor_id);
    },
    onSuccess: (response, investor_id) => {
      toast.success(response?.message && 'Investors deleted successfully');
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

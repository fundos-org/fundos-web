import { updateInvestorDetails } from '@/axioscalls/apiServices';
import { UpdateInvestorRequest } from '@/constants/membersConstant';
import { QueryEnums } from '@/queryEnums';
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from 'react-query';

interface OpenEditDialog {
  investor_id: string;
  subadmin_id: string;
}

export const useInvestorEditDetails = (params: OpenEditDialog | null) => {
  const queryClient = useQueryClient();
  const investor_id = params?.investor_id;
  const subadmin_id = params?.subadmin_id;
  return useMutation({
    mutationFn: (details: UpdateInvestorRequest) =>
      updateInvestorDetails(subadmin_id!, investor_id!, details),
    onSuccess: response => {
      toast.success(
        response?.message && 'Investor Details updated successfully'
      );
      queryClient.invalidateQueries({
        queryKey: [QueryEnums.InvestorDetails, investor_id],
      });
      queryClient.removeQueries({
        queryKey: [QueryEnums.InvestorDetails, investor_id],
      });
      queryClient.invalidateQueries({
        queryKey: [QueryEnums.Investors, subadmin_id],
        exact: false,
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed updating details.');
    },
  });
};

import { updateInvestorDetails } from '@/axioscalls/apiServices';
import { UpdateInvestorRequest } from '@/constants/membersConstant';
import { QueryEnums } from '@/queryEnums';
import { useMutation, useQueryClient } from 'react-query';
interface OpenEditDialog {
  investor_id: string;
  subadmin_id?: string;
}

export const useInvestorEditDetails = (params: OpenEditDialog | null) => {
  const queryClient = useQueryClient();
  const investor_id = params?.investor_id;
  const subadmin_id = params?.subadmin_id;
  return useMutation({
    mutationFn: (details: UpdateInvestorRequest) =>
      updateInvestorDetails(investor_id!, details, subadmin_id!),
    onSuccess: () => {
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
  });
};

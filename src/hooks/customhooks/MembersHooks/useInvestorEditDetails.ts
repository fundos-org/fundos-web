import { updateInvestorDetails } from '@/axioscalls/apiServices';
import { UpdateInvestorRequest } from '@/constants/membersConstant';
import { QueryEnums } from '@/queryEnums';
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from 'react-query';

export const useInvestorEditDetails = (investor_id: string) => {
  const queryClient = useQueryClient();
  //   const subadminDetailsRaw = sessionStorage.getItem(AppEnums.SUBADMIN_SESSION);
  //   const { subadmin_id } = subadminDetailsRaw
  //     ? JSON.parse(subadminDetailsRaw)
  //     : {};

  const subadmin_id = '0a63af64-ad47-45a9-b8eb-efe0e9a08085';
  return useMutation({
    mutationFn: (details: UpdateInvestorRequest) =>
      updateInvestorDetails(subadmin_id, investor_id, details),
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

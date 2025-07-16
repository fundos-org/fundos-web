import { updateDealDetails } from '@/axioscalls/apiServices';
import { DealDetails } from '@/constants/dealsConstant';
import { AppEnums } from '@/constants/enums';
import { QueryEnums } from '@/queryEnums';
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from 'react-query';

export const useDealEditDetails = (deal_id: string) => {
  const queryClient = useQueryClient();
  const subadminDetailsRaw = sessionStorage.getItem(AppEnums.SUBADMIN_SESSION);
  const { subadmin_id } = subadminDetailsRaw
    ? JSON.parse(subadminDetailsRaw)
    : {};

  return useMutation({
    mutationFn: (details: Partial<DealDetails>) =>
      updateDealDetails(subadmin_id, deal_id, details),
    onSuccess: response => {
      toast.success(response?.message && 'Deal Details updated successfully');
      queryClient.invalidateQueries({
        queryKey: [QueryEnums.DealDetails, deal_id],
      });
      queryClient.removeQueries({
        queryKey: [QueryEnums.DealDetails, deal_id],
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

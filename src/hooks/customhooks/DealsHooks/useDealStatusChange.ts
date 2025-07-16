import { changeDealStatus } from '@/axioscalls/apiServices';
import { DealStatus } from '@/constants/dealsConstant';
import { AppEnums } from '@/constants/enums';
import { QueryEnums } from '@/queryEnums';
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from 'react-query';

export const useDealStatusChange = () => {
  const queryClient = useQueryClient();
  const subadminDetailsRaw = sessionStorage.getItem(AppEnums.SUBADMIN_SESSION);
  const { subadmin_id } = subadminDetailsRaw
    ? JSON.parse(subadminDetailsRaw)
    : {};
  return useMutation(
    async ({ deal_id, status }: { deal_id: string; status: DealStatus }) =>
      changeDealStatus(deal_id, status),
    {
      onSuccess: () => {
        toast.success('Deal Status changed successfully');
        queryClient.invalidateQueries({
          queryKey: [QueryEnums.Deals, subadmin_id],
        });
        queryClient.removeQueries({
          queryKey: [QueryEnums.Deals, subadmin_id],
        });
      },
      onError: (error: Error) => {
        toast.error(`Failed to Change status: ${error.message}`);
      },
    }
  );
};

import { changeDealStatus } from '@/axioscalls/apiServices';
import { DealStatus } from '@/constants/dealsConstant';
import { AppEnums } from '@/constants/enums';
import { QueryEnums } from '@/queryEnums';
import { useNotification } from '@/components/custom/NotificationProvider';
import { useMutation, useQueryClient } from 'react-query';

export const useDealStatusChange = () => {
  const queryClient = useQueryClient();
  const notification = useNotification();
  const subadminDetailsRaw = sessionStorage.getItem(AppEnums.SUBADMIN_SESSION);
  const { subadmin_id } = subadminDetailsRaw
    ? JSON.parse(subadminDetailsRaw)
    : {};
  return useMutation(
    async ({ deal_id, status }: { deal_id: string; status: DealStatus }) =>
      changeDealStatus(deal_id, status),
    {
      onSuccess: () => {
        notification.success('Status Updated', 'Deal status changed successfully');
        queryClient.invalidateQueries({
          queryKey: [QueryEnums.Deals, subadmin_id],
        });
        queryClient.removeQueries({
          queryKey: [QueryEnums.Deals, subadmin_id],
        });
      },
      onError: (error: Error) => {
        notification.error('Status Change Failed', `Failed to change status: ${error.message}`);
      },
    }
  );
};

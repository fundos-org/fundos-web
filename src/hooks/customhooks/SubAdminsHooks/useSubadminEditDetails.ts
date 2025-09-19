import { updateSubAdminDetails } from '@/axioscalls/apiServices';
import { SubadminDetailsResponse as SubAdminDetails } from '@/constants/dealsConstant';
import { QueryEnums } from '@/queryEnums';
import { useNotification } from '@/components/custom/NotificationProvider';
import { useMutation, useQueryClient } from 'react-query';

export const useSubadminEditDetails = (subadmin_id: string) => {
  const queryClient = useQueryClient();
  const notification = useNotification();
  
  return useMutation({
    mutationFn: (
      details: Partial<Omit<SubAdminDetails, 'subadmin_id' | 'success'>>
    ) => updateSubAdminDetails(subadmin_id!, details),
    onSuccess: (_, subadmin_id) => {
      notification.success(
        'Update Successful',
        'Sub Admin details have been updated successfully',
        { duration: 4000 }
      );
      queryClient.invalidateQueries({
        queryKey: [QueryEnums.SubAdminDetails, subadmin_id],
      });
      queryClient.invalidateQueries({
        queryKey: [QueryEnums.SubAdminDetails, subadmin_id],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: [QueryEnums.SubAdmins],
      });
      queryClient.invalidateQueries({
        queryKey: [QueryEnums.SubAdmins],
        exact: false,
      });
    },
    onError: (error: Error) => {
      notification.error(
        'Update Failed',
        error.message || 'Failed to update sub admin details. Please try again.',
        { duration: 5000 }
      );
    },
  });
};

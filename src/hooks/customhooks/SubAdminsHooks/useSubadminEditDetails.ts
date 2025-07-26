import { updateSubAdminDetails } from '@/axioscalls/apiServices';
import { SubadminDetailsResponse as SubAdminDetails } from '@/constants/dealsConstant';
import { QueryEnums } from '@/queryEnums';
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from 'react-query';

export const useSubadminEditDetails = (subadmin_id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (
      details: Partial<Omit<SubAdminDetails, 'subadmin_id' | 'success'>>
    ) => updateSubAdminDetails(subadmin_id!, details),
    onSuccess: (response, subadmin_id) => {
      toast.success(
        response?.message && 'SubAdmin Details updated successfully'
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
      toast.error(error.message || 'Failed updating details.');
    },
  });
};

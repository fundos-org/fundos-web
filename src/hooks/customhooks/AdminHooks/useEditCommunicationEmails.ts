import { updateCommunicationEmails } from '@/axioscalls/apiServices';
import { EmailTemplatesResponse } from '@/constants/dashboardConstant';
import { QueryEnums } from '@/queryEnums';
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from 'react-query';

export const useEditCommunicationEmails = (subadmin_id?: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (
      details: Partial<Omit<EmailTemplatesResponse, 'subadmin_id' | 'success'>>
    ) => updateCommunicationEmails(details, subadmin_id!),
    onSuccess: response => {
      toast.success(
        response?.message && 'Communication Email Details updated successfully'
      );
      queryClient.invalidateQueries({
        queryKey: [QueryEnums.CommunicationEmails, subadmin_id],
      });
      queryClient.removeQueries({
        queryKey: [QueryEnums.CommunicationEmails, subadmin_id],
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed updating emails.');
    },
  });
};

import { updateCommunicationEmails } from '@/axioscalls/apiServices';
import { EmailTemplatesResponse } from '@/constants/dashboardConstant';
import { QueryEnums } from '@/queryEnums';
import { useMutation, useQueryClient } from 'react-query';

export const useEditCommunicationEmails = (
  subadmin_id?: string,
  onSuccess?: (response: any) => void,
  onError?: (error: Error) => void
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (
      details: Partial<Omit<EmailTemplatesResponse, 'subadmin_id' | 'success'>>
    ) => updateCommunicationEmails(details, subadmin_id!),
    onSuccess: response => {
      queryClient.invalidateQueries({
        queryKey: [QueryEnums.CommunicationEmails, subadmin_id],
      });
      queryClient.removeQueries({
        queryKey: [QueryEnums.CommunicationEmails, subadmin_id],
      });
      onSuccess?.(response);
    },
    onError: (error: Error) => {
      onError?.(error);
    },
  });
};

import { deleteInvestor } from '@/axioscalls/apiServices';
import { QueryEnums } from '@/queryEnums';
import { useNotification } from '@/components/custom/NotificationProvider';
import { useMutation, useQueryClient } from 'react-query';

interface OpenEditDialog {
  investor_id: string;
  subadmin_id?: string;
}

export const useInvestorDelete = () => {
  const queryClient = useQueryClient();
  const notification = useNotification();
  
  return useMutation({
    mutationFn: ({ investor_id, subadmin_id }: OpenEditDialog) => {
      return deleteInvestor(investor_id, subadmin_id);
    },
    onSuccess: (response, investor_id) => {
      if (response.success) {
        notification.success('Investor Deleted', response?.message || 'Investor deleted successfully');
      } else {
        notification.error('Delete Failed', response?.message || 'Failed to delete investor');
      }
      queryClient.invalidateQueries({
        queryKey: [QueryEnums.Investors],
      });
      queryClient.removeQueries({
        queryKey: [QueryEnums.Investors, investor_id],
      });
    },
    onError: (error: Error) => {
      notification.error('Delete Failed', `Delete investor failed: ${error.message}`);
    },
  });
};

import { bulkOnboarding } from '@/axioscalls/apiServices';
import { BulkOnboardingUserData } from '@/constants/dashboardConstant';
import { useNotification } from '@/components/custom/NotificationProvider';
import { useMutation } from 'react-query';

export const useBulkOnboarding = () => {
  const notification = useNotification();
  
  return useMutation({
    mutationFn: (data: Omit<BulkOnboardingUserData, 'remark'>[]) =>
      bulkOnboarding(data),
    onSuccess: () => {
      notification.success('Bulk Onboarding Complete', 'Bulk onboarding completed successfully');
    },
    onError: (error: Error) => {
      notification.error('Onboarding Failed', error.message || 'Failed updating emails.');
    },
  });
};

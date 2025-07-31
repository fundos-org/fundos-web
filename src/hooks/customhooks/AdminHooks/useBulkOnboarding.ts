import { bulkOnboarding } from '@/axioscalls/apiServices';
import { BulkOnboardingUserData } from '@/constants/dashboardConstant';
import toast from 'react-hot-toast';
import { useMutation } from 'react-query';

export const useBulkOnboarding = () => {
  return useMutation({
    mutationFn: (data: Omit<BulkOnboardingUserData, 'remark'>[]) =>
      bulkOnboarding(data),
    onSuccess: () => {
      toast.success('Bulk Onboarding done successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed updating emails.');
    },
  });
};

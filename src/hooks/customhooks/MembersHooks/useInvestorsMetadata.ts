import { getInvestorMetadata } from '@/axioscalls/apiServices';
import { QueryEnums } from '@/queryEnums';
import { useNotification } from '@/components/custom/NotificationProvider';
import { useQuery } from 'react-query';

export const useInvestorsMetadata = (isSubadmin?: boolean) => {
  const notification = useNotification();
  
  return useQuery([QueryEnums.InvestorMetadata], () => getInvestorMetadata(), {
    enabled: isSubadmin,
    refetchOnWindowFocus: false,
    retry: 2,
    keepPreviousData: true, // useful for pagination
    // staleTime: 1000 * 60 * 60 * 6, // 6 hours
    onSuccess: () => notification.success('Data Loaded', 'Investors fetched successfully'),
    onError: () => {
      notification.error('Loading Failed', 'Fetching stats failed!');
    },
  });
};

//useSubadminDashboardMetadata
import { fetchDashboardStatistics } from '@/axioscalls/apiServices';
import { QueryEnums } from '@/queryEnums';
import toast from 'react-hot-toast';
import { useQuery } from 'react-query';

export const useSubadminDashboardMetadata = (isSubadmin?: boolean) => {
  return useQuery(
    [QueryEnums.SubadminDashboardMetadata],
    fetchDashboardStatistics,
    {
      enabled: isSubadmin,
      refetchOnWindowFocus: false,
      retry: 2,
      keepPreviousData: true, // useful for pagination
      // staleTime: 1000 * 60 * 60 * 6, // 6 hours
      onSuccess: () => toast.success('Investors fetched successfully'),
      onError: () => {
        toast.error(`Fetching Stats failed!`);
      },
    }
  );
};

//getAdminDashboardStats
import { getAdminDashboardStats } from '@/axioscalls/apiServices';
import { QueryEnums } from '@/queryEnums';
import toast from 'react-hot-toast';
import { useQuery } from 'react-query';

export const useAdminDashboardStats = () => {
  return useQuery([QueryEnums.AdminMetadata], () => getAdminDashboardStats(), {
    refetchOnWindowFocus: false,
    retry: 2,
    keepPreviousData: true, // useful for pagination
    // staleTime: 1000 * 60 * 60 * 6, // 6 hours
    onSuccess: () => toast.success('Admins Sats fetched successfully'),
    onError: (error: Error) => {
      toast.error(`Fetch investors failed: ${error.message}`);
    },
  });
};

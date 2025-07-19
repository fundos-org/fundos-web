import { getDeals } from '@/axioscalls/apiServices';
import { QueryEnums } from '@/queryEnums';
import toast from 'react-hot-toast';
import { useQuery } from 'react-query';

// getDeals
export const useDeals = (subadmin_id?: string) => {
  return useQuery(
    [QueryEnums.Deals, subadmin_id],
    () => getDeals(subadmin_id!),
    {
      enabled: !!subadmin_id,
      refetchOnWindowFocus: false,
      retry: 2,
      keepPreviousData: true, // useful for pagination
      staleTime: 1000 * 60 * 60, // 1 hour
      onSuccess: () => toast.success('Investors fetched successfully'),
      onError: (error: Error) => {
        toast.error(`Fetch investors failed: ${error.message}`);
      },
    }
  );
};

import { getSubAdminDetails } from '@/axioscalls/apiServices';
import { QueryEnums } from '@/queryEnums';
import toast from 'react-hot-toast';
import { useQuery } from 'react-query';

export const useSubadminDetails = (subadmin_id: string) => {
  return useQuery(
    [QueryEnums.SubAdminDetails, subadmin_id],
    () => getSubAdminDetails(subadmin_id),
    {
      enabled: !!subadmin_id,
      refetchOnWindowFocus: false,
      retry: 2,
      keepPreviousData: true, // useful for pagination
      //   staleTime: 1000 * 60 * 60, // 1 hour
      onError: (error: Error) => {
        toast.error(`Fetch investors failed: ${error.message}`);
      },
    }
  );
};

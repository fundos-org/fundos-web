import { getInvestors } from '@/axioscalls/apiServices';
import { AppEnums } from '@/constants/enums';
import { QueryEnums } from '@/queryEnums';
import toast from 'react-hot-toast';
import { useQuery, useQueryClient } from 'react-query';

export const useInvestors = (
  pageNumber: number,
  pageSize: number,
  subAdminIdFromAdmin: string = ''
) => {
  const subadminDetailsRaw = sessionStorage.getItem(AppEnums.SUBADMIN_SESSION);
  const { subadmin_id } = subadminDetailsRaw
    ? JSON.parse(subadminDetailsRaw)
    : {};
  const queryClient = useQueryClient();
  return useQuery(
    [QueryEnums.Investors, subadmin_id, pageNumber, pageSize],
    () =>
      getInvestors(subadmin_id ?? subAdminIdFromAdmin, pageNumber, pageSize),
    {
      enabled: !!subadmin_id || !!subAdminIdFromAdmin,
      refetchOnWindowFocus: false,
      retry: 2,
      keepPreviousData: true, // useful for pagination
      staleTime: 1000 * 60 * 60, // 1 hour
      onSuccess: () => {
        const queryKey = [
          QueryEnums.Investors,
          subadmin_id,
          pageNumber,
          pageSize,
        ];
        const queryState = queryClient.getQueryState(queryKey);

        if (queryState) {
          // Check if the data is fresh (not from cache) using dataUpdatedAt
          const isFresh = queryState.dataUpdatedAt > Date.now() - 1000; // 1 second threshold
          if (isFresh) toast.success('Investors fetched successfully');
        }
      },
      onError: (error: Error) => {
        toast.error(`Fetch investors failed: ${error.message}`);
      },
    }
  );
};

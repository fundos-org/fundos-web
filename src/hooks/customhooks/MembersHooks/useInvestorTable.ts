import { getInvestors } from '@/axioscalls/apiServices';
import { QueryEnums } from '@/queryEnums';
import toast from 'react-hot-toast';
import { useQuery, useQueryClient } from 'react-query';

export const useInvestors = (
  pageNumber: number,
  pageSize: number,
  subAdminIdFromAdmin?: string
) => {
  const queryClient = useQueryClient();
  return useQuery(
    [QueryEnums.Investors, pageNumber, pageSize],
    () => getInvestors(pageNumber, pageSize, subAdminIdFromAdmin),
    {
      enabled: !!subAdminIdFromAdmin,
      refetchOnWindowFocus: false,
      retry: 2,
      // keepPreviousData: true, // useful for pagination
      // staleTime: 1000 * 60 * 60, // 1 hour
      onSuccess: () => {
        const queryKey = [QueryEnums.Investors, pageNumber, pageSize];
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

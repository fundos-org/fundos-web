import { getAdminOverview } from '@/axioscalls/apiServices';
import { QueryEnums } from '@/queryEnums';
import toast from 'react-hot-toast';
import { useQuery, useQueryClient } from 'react-query';

export const useAdminOverviewTable = (pageNumber: number, pageSize: number) => {
  const queryClient = useQueryClient();
  return useQuery(
    [QueryEnums.AdminOverview, pageNumber, pageSize],
    () => getAdminOverview(pageNumber, pageSize),
    {
      refetchOnWindowFocus: false,
      retry: 2,
      keepPreviousData: true, // useful for pagination
      // staleTime: 1000 * 60 * 60, // 1 hour
      onSuccess: () => {
        const queryKey = [QueryEnums.AdminOverview, pageNumber, pageSize];
        const queryState = queryClient.getQueryState(queryKey);

        if (queryState) {
          // Check if the data is fresh (not from cache) using dataUpdatedAt
          const isFresh = queryState.dataUpdatedAt > Date.now() - 1000; // 1 second threshold
          if (isFresh) toast.success('Admin Overview fetched successfully');
        }
      },
      onError: (error: Error) => {
        toast.error(`Fetch overview details failed: ${error.message}`);
      },
    }
  );
};

import { getDeals } from '@/axioscalls/apiServices';
import { QueryEnums } from '@/queryEnums';
import toast from 'react-hot-toast';
import { QueryClient, useQuery } from 'react-query';

const queryClient = new QueryClient();

export const useDealTable = (
  activePageNumber: number = 1,
  activePageSize: number = 3,
  closedPageNumber: number = 1,
  closedPageSize: number = 3,
  onholdPageNumber: number = 1,
  onholdPageSize: number = 3,
  subadmin_id?: string
) => {
  return useQuery(
    [
      QueryEnums.Deals,
      subadmin_id,
      activePageNumber,
      activePageSize,
      closedPageNumber,
      closedPageSize,
      onholdPageNumber,
      onholdPageSize,
    ],
    () =>
      getDeals(
        subadmin_id!,
        activePageNumber,
        activePageSize,
        closedPageNumber,
        closedPageSize,
        onholdPageNumber,
        onholdPageSize
      ),
    {
      enabled: !!subadmin_id,
      refetchOnWindowFocus: false,
      retry: 2,
      keepPreviousData: true, // useful for pagination
      // staleTime: 1000 * 60 * 60, // 1 hour
      onSuccess: () => toast.success('Deals fetched successfully'),
      onError: (error: Error) => {
        toast.error(`Fetching Deals failed: ${error.message}`);
      },
    }
  );
};

export const invalidateDealsTableQuery = () => {
  queryClient.invalidateQueries({
    queryKey: [QueryEnums.Deals],
  });
};

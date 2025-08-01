import { getInvestorMetadata } from '@/axioscalls/apiServices';
import { QueryEnums } from '@/queryEnums';
import toast from 'react-hot-toast';
import { useQuery } from 'react-query';

export const useInvestorsMetadata = (subadmin_id?: string) => {
  return useQuery(
    [QueryEnums.InvestorMetadata],
    () => getInvestorMetadata(subadmin_id),
    {
      // enabled: !!subadmin_id,
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

import { getInvestorMetadata } from '@/axioscalls/apiServices';
import { AppEnums } from '@/constants/enums';
import { QueryEnums } from '@/queryEnums';
import toast from 'react-hot-toast';
import { useQuery } from 'react-query';

export const useInvestorsMetadata = () => {
  const subadminDetailsRaw = sessionStorage.getItem(AppEnums.SUBADMIN_SESSION);
  const { subadmin_id } = subadminDetailsRaw
    ? JSON.parse(subadminDetailsRaw)
    : {};
  return useQuery(
    [QueryEnums.InvestorsMetadata],
    () => getInvestorMetadata(subadmin_id),
    {
      enabled: !!subadmin_id,
      refetchOnWindowFocus: false,
      retry: 2,
      keepPreviousData: true, // useful for pagination
      // staleTime: 1000 * 60 * 60 * 6, // 6 hours
      onSuccess: () => toast.success('Investors fetched successfully'),
      onError: (error: Error) => {
        toast.error(`Fetch investors failed: ${error.message}`);
      },
    }
  );
};

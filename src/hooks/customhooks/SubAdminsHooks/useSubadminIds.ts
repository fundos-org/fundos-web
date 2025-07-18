import { getSubadminIdList } from '@/axioscalls/apiServices';
import { QueryEnums } from '@/queryEnums';
import toast from 'react-hot-toast';
import { useQuery } from 'react-query';

export const useSubadminIds = (isInvestor: boolean) => {
  return useQuery([QueryEnums.SubadminIds], () => getSubadminIdList(), {
    enabled: !isInvestor,
    refetchOnWindowFocus: false,
    retry: 2,
    keepPreviousData: true, // useful for pagination
    staleTime: Infinity,
    onError: (error: Error) => {
      toast.error(`Fetch ids failed: ${error.message}`);
    },
  });
};

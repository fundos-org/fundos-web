import { getSubadminIdList } from '@/axioscalls/apiServices';
import { QueryEnums } from '@/queryEnums';
import { useQuery } from 'react-query';

export const useSubadminIds = (
  isInvestor: boolean,
  onError?: (error: Error) => void
) => {
  return useQuery([QueryEnums.SubadminIds], () => getSubadminIdList(), {
    enabled: !isInvestor,
    refetchOnWindowFocus: false,
    retry: 2,
    keepPreviousData: true, // useful for pagination
    staleTime: Infinity,
    onError,
  });
};

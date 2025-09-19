import createDraft from '@/axioscalls/apiServices';
import { QueryEnums } from '@/queryEnums';
import { useQuery } from 'react-query';

export const useDealDraftId = (
  isSubadmin: boolean | undefined,
  onError?: (error: Error) => void
) => {
  return useQuery([QueryEnums.DealDraftId], () => createDraft(), {
    enabled: isSubadmin,
    refetchOnWindowFocus: false,
    retry: 2,
    // keepPreviousData: true, // useful for pagination
    //   staleTime: 1000 * 60 * 60, // 1 hour
    // onSuccess: () => toast.success('Deal draft id fetched successfully'),
    onError,
  });
};

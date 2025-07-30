import createDraft from '@/axioscalls/apiServices';
import { QueryEnums } from '@/queryEnums';
import toast from 'react-hot-toast';
import { useQuery } from 'react-query';

export const useDealDraftId = () => {
  return useQuery([QueryEnums.DealDraftId], () => createDraft(), {
    refetchOnWindowFocus: false,
    retry: 2,
    // keepPreviousData: true, // useful for pagination
    //   staleTime: 1000 * 60 * 60, // 1 hour
    onSuccess: () => toast.success('Deal draft id fetched successfully'),
    onError: (error: Error) => {
      toast.error(`${error.message}`);
    },
  });
};

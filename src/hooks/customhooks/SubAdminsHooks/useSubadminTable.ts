import { getSubadmins } from '@/axioscalls/apiServices';
import { QueryEnums } from '@/queryEnums';
import toast from 'react-hot-toast';
import { useQuery } from 'react-query';

export const useSubadminsTable = (pageNumber: number, pageSize: number) => {
  return useQuery(
    [QueryEnums.SubAdmins, pageNumber, pageSize],
    () => getSubadmins(pageNumber, pageSize),
    {
      refetchOnWindowFocus: false,
      retry: 2,
      keepPreviousData: true, // useful for pagination
      onError: (error: Error) => {
        toast.error(`Fetch investors failed: ${error.message}`);
      },
    }
  );
};

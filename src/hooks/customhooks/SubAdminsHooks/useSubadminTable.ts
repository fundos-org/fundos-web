import { getSubadmins } from '@/axioscalls/apiServices';
import { QueryEnums } from '@/queryEnums';
import { useQuery } from 'react-query';

export const useSubadminsTable = (
  pageNumber: number, 
  pageSize: number,
  onError?: (error: Error) => void
) => {
  return useQuery(
    [QueryEnums.SubAdmins, pageNumber, pageSize],
    () => getSubadmins(pageNumber, pageSize),
    {
      refetchOnWindowFocus: false,
      retry: 2,
      keepPreviousData: true, // useful for pagination
      onError,
    }
  );
};

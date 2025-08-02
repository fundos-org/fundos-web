import { getCommunicationEmails } from '@/axioscalls/apiServices';
import { QueryEnums } from '@/queryEnums';
import toast from 'react-hot-toast';
import { useQuery } from 'react-query';

export const useCommunicationEmails = (
  subadmin_id?: string,
  isSubadmin?: boolean
) => {
  return useQuery(
    [QueryEnums.CommunicationEmails, subadmin_id],
    () => getCommunicationEmails(subadmin_id!),
    {
      enabled: !!subadmin_id || isSubadmin,
      refetchOnWindowFocus: false,
      retry: 2,
      keepPreviousData: true, // useful for pagination
      // staleTime: 1000 * 60 * 60, // 1 hour
      onSuccess: () => toast.success('Investor Details fetched successfully'),
      onError: (error: Error) => {
        toast.error(`Fetch investors failed: ${error.message}`);
      },
    }
  );
};

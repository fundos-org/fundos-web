import { getInvestorDocuments } from '@/axioscalls/apiServices';
import { QueryEnums } from '@/queryEnums';
import toast from 'react-hot-toast';
import { useQuery } from 'react-query';

export const useInvestorDocuments = (investor_id: string) => {
  return useQuery(
    [QueryEnums.InvestorDocuments, investor_id],
    () => getInvestorDocuments(investor_id),
    {
      enabled: !!investor_id,
      refetchOnWindowFocus: false,
      retry: 2,
      keepPreviousData: true, // useful for pagination
      staleTime: 1000 * 60 * 60, // 1 hour
      onSuccess: () => toast.success('Investor Documents fetched successfully'),
      onError: (error: Error) => {
        toast.error(`Fetch investors failed: ${error.message}`);
      },
    }
  );
};

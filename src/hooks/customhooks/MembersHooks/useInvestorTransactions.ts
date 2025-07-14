import { getInvestorTransactions } from '@/axioscalls/apiServices';
import { QueryEnums } from '@/queryEnums';
import toast from 'react-hot-toast';
import { useQuery } from 'react-query';

export const useInvestorTransactions = (investor_id: string) => {
  return useQuery(
    [QueryEnums.InvestorTransactions, investor_id],
    () => getInvestorTransactions(investor_id),
    {
      enabled: !!investor_id,
      refetchOnWindowFocus: false,
      retry: 2,
      keepPreviousData: true, // useful for pagination
      staleTime: 1000 * 60 * 60, // 1 hour
      onSuccess: () =>
        toast.success('Investor Investments fetched successfully'),
      onError: (error: Error) => {
        toast.error(`Fetch investors failed: ${error.message}`);
      },
    }
  );
};

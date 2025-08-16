import { getInvestorTransactions } from '@/axioscalls/apiServices';
import isThisSubadmin from '@/lib/isSubadmin';
import { QueryEnums } from '@/queryEnums';
import toast from 'react-hot-toast';
import { useQuery } from 'react-query';

export const useInvestorTransactions = (
  pageNumber: number,
  pageSize: number,
  investor_id: string,
  subadmin_id?: string | null
) => {
  const isThisSubAdmin = isThisSubadmin();
  return useQuery(
    [
      QueryEnums.InvestorTransactions,
      investor_id,
      pageNumber,
      pageSize,
      subadmin_id,
    ],
    () =>
      getInvestorTransactions(pageNumber, pageSize, investor_id, subadmin_id!),
    {
      enabled: isThisSubAdmin ? !!investor_id : !!investor_id && !!subadmin_id,
      refetchOnWindowFocus: false,
      retry: 2,
      keepPreviousData: true, // useful for pagination
      // staleTime: 1000 * 60 * 60, // 1 hour
      // onSuccess: () =>
      //   toast.success('Investor Investments fetched successfully'),
      onError: (error: Error) => {
        toast.error(`Fetch investors failed: ${error.message}`);
      },
    }
  );
};

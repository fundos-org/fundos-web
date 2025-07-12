import { getInvestors } from '@/axioscalls/apiServices';
// import { AppEnums } from '@/constants/enums';
import { QueryEnums } from '@/queryEnums';
import toast from 'react-hot-toast';
import { useQuery } from 'react-query';

export const useInvestors = (pageNumber: number, pageSize: number) => {
  //   const subadminDetailsRaw = sessionStorage.getItem(AppEnums.SUBADMIN_SESSION);
  //   const { subadmin_id } = subadminDetailsRaw
  //     ? JSON.parse(subadminDetailsRaw)
  //     : {};

  const subadmin_id = '0a63af64-ad47-45a9-b8eb-efe0e9a08085';
  return useQuery(
    [QueryEnums.Investors, subadmin_id, pageNumber, pageSize],
    () => getInvestors(subadmin_id, pageNumber, pageSize),
    {
      enabled: !!subadmin_id,
      keepPreviousData: true, // useful for pagination
      staleTime: 1000 * 120, // 2 minute
      onSuccess: () => toast.success('Investors fetched successfully'),
      onError: (error: Error) => {
        toast.error(`Fetch investors failed: ${error.message}`);
      },
    }
  );
};

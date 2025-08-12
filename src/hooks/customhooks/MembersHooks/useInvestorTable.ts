import { getInvestors } from '@/axioscalls/apiServices';
import {
  OnboardingStatus,
  InvestorType,
  KycStatus,
} from '@/constants/investorsConstant';
import { QueryEnums } from '@/queryEnums';
import toast from 'react-hot-toast';
import { useQuery } from 'react-query';

export const useInvestors = ({
  pageNumber,
  pageSize,
  subAdminId,
  isSubadmin,
  onboarding_status,
  investor_type,
  kyc_status,
}: Partial<{
  pageNumber: number;
  pageSize: number;
  subAdminId?: string;
  isSubadmin?: boolean;
  onboarding_status?: OnboardingStatus;
  investor_type?: InvestorType;
  kyc_status?: KycStatus;
}>) => {
  return useQuery(
    [
      QueryEnums.Investors,
      pageNumber,
      pageSize,
      onboarding_status,
      investor_type,
      kyc_status,
      subAdminId,
    ],
    () =>
      getInvestors({
        pageNumber,
        pageSize,
        subAdminId,
        kyc_status,
        onboarding_status,
        investor_type,
      }),
    {
      enabled: (!!subAdminId || isSubadmin) && !!pageNumber && !!pageSize,
      refetchOnWindowFocus: false,
      retry: 2,
      onError: (error: Error) => {
        toast.error(`Fetch investors failed: ${error.message}`);
      },
    }
  );
};

import { appLogin } from '@/axioscalls/apiServices';
import {
  AdminLoginResponse,
  SubadminLoginResponse,
} from '@/constants/dashboardConstant';
import { LoginFormData } from '@/constants/dealsConstant';
import { useMutation } from 'react-query';

type LoginResponseMap = {
  admin: AdminLoginResponse;
  subadmin: SubadminLoginResponse;
  kyc: SubadminLoginResponse;
};

export const useAppLogin = <T extends keyof LoginResponseMap>(role: T) => {
  return useMutation(
    async (data: LoginFormData): Promise<LoginResponseMap[T]> => {
      const response = await appLogin(data, role);
      return response as LoginResponseMap[T];
    },
    {
      // Prevent automatic error throwing to handle errors gracefully
      retry: false, // Don't retry failed login attempts
    }
  );
};

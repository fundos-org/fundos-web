import { appLogin } from '@/axioscalls/apiServices';
import { LoginFormData } from '@/constants/dealsConstant';
import { useMutation } from 'react-query';

export const useAppLogin = () => {
  return useMutation({
    mutationFn: (data: LoginFormData) => appLogin(data),
  });
};

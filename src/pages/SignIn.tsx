import { useForm } from 'react-hook-form';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LoginFormData } from '@/constants/dealsConstant';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppRoute } from '@/RoutesEnum';
import { AppEnums, AWS_BUCKET_NAME } from '@/constants/enums';
import { useAppLogin } from '@/hooks/useAppLogin';
import { cleanupAxios } from '@/axioscalls/axiosConfig';
import toast from 'react-hot-toast';
import Stars from '@/components/custom/Stars';
import ResetPassword from '@/components/custom/ResetPassword';
import {
  AuthTokens,
  SubadminLoginResponse,
} from '@/constants/dashboardConstant';
import { getFileUrl } from '@/hooks/useAwsFileObjectKey';

export type ColorScheme = {
  name: string;
  role: 'admin' | 'subadmin' | 'kyc';
  background: string;
  cardBg: string;
  inputBg: string;
  inputBorder: string;
  inputText: string;
  focusRing: string;
  buttonBg: string;
  buttonHover: string;
  buttonText?: string;
  starColor: string;
};

// Color scheme configuration based on domain
const getColorScheme = (): ColorScheme => {
  const hostname = window.location.hostname;

  if (hostname.includes('kyc.fundos.services')) {
    return {
      name: 'KYC Portal',
      role: 'kyc',
      background:
        'bg-gradient-to-br from-orange-900 via-yellow-700 via-pink-700 to-rose-900',
      cardBg: 'bg-gradient-to-br from-white via-yellow-50 to-pink-50',
      inputBg: 'bg-gradient-to-r from-white via-yellow-100 to-pink-100',
      inputBorder: 'border-orange-600',
      inputText: 'text-gray-900',
      focusRing: 'focus:ring-orange-500',
      buttonBg: 'bg-gradient-to-r from-orange-600 via-yellow-500 to-pink-500',
      buttonHover:
        'hover:from-orange-500 hover:via-yellow-400 hover:to-pink-400',
      buttonText: 'text-white',
      starColor: 'bg-gradient-to-r from-yellow-200 via-pink-200 to-orange-200',
    };
  } else if (hostname.includes('subadmin.fundos.services')) {
    return {
      name: 'Fund Manager',
      role: 'subadmin',
      background: 'bg-gradient-to-br from-gray-900 via-gray-800 to-black',
      cardBg: 'bg-zinc-900/40',
      inputBg: 'bg-gray-800',
      inputBorder: 'border-gray-600',
      inputText: 'text-white',
      focusRing: 'focus:ring-gray-500',
      buttonBg: 'bg-white cursor-pointer',
      buttonHover: 'hover:bg-gray-200',
      buttonText: 'text-black',
      starColor: 'bg-white',
    };
  } else if (hostname.includes('admin.fundos.services')) {
    return {
      name: 'Admin',
      role: 'admin',
      background: 'gradient-bg-fundos',
      cardBg:
        'bg-white/10 hover:bg-zinc-800/80 transition-all duration-300 ease-in-out',
      inputBg: 'bg-blue-100',
      inputText: 'text-black',
      inputBorder: 'border-gray-500',
      focusRing: 'focus:ring-blue-400',
      buttonBg: 'bg-black cursor-pointer border border-zinc-700',
      buttonHover: 'hover:bg-gray-600',
      buttonText: 'text-white',
      starColor: 'bg-blue-200',
    };
  } else {
    // return {
    //   name: 'Fund Manager',
    //   role: 'subadmin',
    //   background: 'bg-gradient-to-br from-gray-900 via-gray-800 to-black',
    //   cardBg: 'bg-zinc-900/40',
    //   inputBg: 'bg-gray-800',
    //   inputBorder: 'border-gray-600',
    //   inputText: 'text-white',
    //   focusRing: 'focus:ring-gray-500',
    //   buttonBg: 'bg-white cursor-pointer',
    //   buttonHover: 'hover:bg-gray-200',
    //   buttonText: 'text-black',
    //   starColor: 'bg-white',
    // };
    return {
      name: 'Admin',
      role: 'admin',
      background: 'gradient-bg-fundos',
      cardBg:
        'bg-white/10 hover:bg-zinc-800/80 transition-all duration-300 ease-in-out',
      inputBg: 'bg-blue-100',
      inputText: 'text-black',
      inputBorder: 'border-gray-500',
      focusRing: 'focus:ring-blue-400',
      buttonBg: 'bg-black cursor-pointer border border-zinc-700',
      buttonHover: 'hover:bg-gray-600',
      buttonText: 'text-white',
      starColor: 'bg-blue-200',
    };
  }
};

export default function SignIn() {
  const [role, setRole] = useState<'admin' | 'subadmin' | 'kyc'>();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [resetPassword, setResetPassword] = useState(false);
  const colorScheme = getColorScheme();
  const { mutateAsync: loginUser } = useAppLogin(colorScheme.role);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    defaultValues: {
      username: '',
      password: '',
    },
  });

  useEffect(() => {
    sessionStorage.clear();
    if (!role) setRole(getColorScheme().role);
  }, [role]);

  useEffect(() => {
    // Cleanup on component unmount
    return () => {
      cleanupAxios();
    };
  }, []);

  const onSubmit = async (data: LoginFormData) => {
    switch (role) {
      case 'admin': {
        data.role = 'ADMIN';
        const { tokens: { access_token, refresh_token } = {} as AuthTokens } =
          await loginUser(data);
        if (access_token) {
          const sessData = JSON.stringify({ role: 'admin', name: 'Amit' });
          sessionStorage.setItem(AppEnums.ACCESS_TOKEN, access_token);
          sessionStorage.setItem(AppEnums.REFRESH_TOKEN, refresh_token);
          sessionStorage.setItem(AppEnums.SUBADMIN_SESSION, sessData);
          toast.success('Admin login successful!');
          navigate(AppRoute.ADMIN_SUBADMIN);
        } else {
          toast.error('Unable to login. Please check once again!', {
            style: { borderRadius: 0 },
          });
        }
        break;
      }
      case 'subadmin': {
        data.role = 'SUBADMIN';
        const {
          role,
          logo: logoKey,
          name,
          invite_code,
          email,
          contact,
          username,
          about,
          app_link,
          app_name,
          tokens: { access_token, refresh_token } = {} as AuthTokens,
        } = (await loginUser(data)) as SubadminLoginResponse;
        const logo = await getFileUrl(AWS_BUCKET_NAME, logoKey);
        if (access_token) {
          const sessData = JSON.stringify({
            role,
            name,
            logo,
            invite_code,
            email,
            contact,
            username,
            about,
            app_link,
            app_name,
          });
          sessionStorage.setItem(AppEnums.ACCESS_TOKEN, access_token);
          sessionStorage.setItem(AppEnums.REFRESH_TOKEN, refresh_token);
          sessionStorage.setItem(AppEnums.SUBADMIN_SESSION, sessData);
          toast.success('Subadmin login successful!');
          navigate(AppRoute.SUBADMIN_DASHBOARD);
        } else {
          toast.error('Unable to login. Please check once again!', {
            style: { borderRadius: 0 },
          });
        }
        break;
      }
      case 'kyc': {
        data.role = 'KYC';
        toast.error('KYC login is not implemented yet.');
        break;
      }
      default: {
        toast.error('Please select a valid role to login.');
        break;
      }
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center ${colorScheme.background} relative overflow-hidden`}
    >
      <Stars starColor={colorScheme.starColor} />

      {/* Main content */}
      <div className="relative z-10 text-center">
        <h1 className="text-5xl font-bold text-white mb-10">
          {colorScheme.name}
        </h1>

        {/* Login Form */}
        {!resetPassword ? (
          <div
            className={`${colorScheme.cardBg} backdrop-blur-lg p-8 rounded-none shadow-lg w-[40rem] max-w-md border-[1px] border-gray-700`}
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Username Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="username"
                  className="text-gray-400 text-sm uppercase"
                >
                  Username
                </Label>
                <Input
                  id="username"
                  placeholder="Enter username"
                  className={`${colorScheme.inputBg} ${colorScheme.inputText} rounded-none ${colorScheme.inputBorder} placeholder-gray-500 focus:ring-2 ${colorScheme.focusRing}`}
                  {...register('username', {
                    required: 'Username is required',
                  })}
                />
                {errors.username && (
                  <p className="text-red-500 text-sm">
                    {errors.username.message}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2 relative">
                <Label
                  htmlFor="password"
                  className="text-gray-400 text-sm uppercase"
                >
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter password"
                    className={`${colorScheme.inputBg} ${colorScheme.inputText} rounded-none ${colorScheme.inputBorder} placeholder-gray-500 focus:ring-2 ${colorScheme.focusRing} pr-10`}
                    {...register('password', {
                      required: 'Password is required',
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-200"
                  >
                    {!showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm">
                    {errors.password.message}
                  </p>
                )}
              </div>
              {colorScheme.role !== 'admin' && (
                <div
                  className="text-gray-400 text-sm cursor-pointer text-start"
                  onClick={() => setResetPassword(true)}
                >
                  Forget Password?{' '}
                  <span className="text-blue-400">Reset using email.</span>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                className={`w-full ${colorScheme.buttonBg} rounded-none ${colorScheme.buttonText || 'text-white'} ${colorScheme.buttonHover} font-semibold py-3`}
              >
                Login
              </Button>
            </form>
          </div>
        ) : (
          <ResetPassword
            colorScheme={colorScheme}
            backToSignIn={() => setResetPassword(false)}
          />
        )}
      </div>
      <div className="absolute bottom-7">
        <img src={'/logo.svg'} width={150} alt="Fundos" />
      </div>
    </div>
  );
}

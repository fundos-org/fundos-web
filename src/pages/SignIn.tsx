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
import ResetPassword from '@/components/custom/ResetPassword';
import WelcomeScreen from '@/components/custom/WelcomeScreen';
import ErrorAlert from '@/components/custom/ErrorAlert';
import { useNotification } from '@/components/custom/NotificationProvider';
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
  const [showWelcome, setShowWelcome] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const colorScheme = getColorScheme();
  const { mutateAsync: loginUser } = useAppLogin(colorScheme.role);
  const notification = useNotification();
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

  // Helper function to format error messages for better UX
  const formatLoginErrorMessage = (apiMessage: string, fallbackMessage: string) => {
    if (!apiMessage) return fallbackMessage;
    
    // Handle specific API error messages
    const lowerMessage = apiMessage.toLowerCase();
    
    if (lowerMessage.includes('no subadmin found') || lowerMessage.includes('user not found')) {
      return 'No account found with these credentials. Please check your username or contact support.';
    }
    
    if (lowerMessage.includes('invalid credentials') || lowerMessage.includes('authentication failed')) {
      return 'Invalid username or password. Please check your credentials and try again.';
    }
    
    if (lowerMessage.includes('account locked') || lowerMessage.includes('locked')) {
      return 'Your account has been locked. Please contact support for assistance.';
    }
    
    if (lowerMessage.includes('account disabled') || lowerMessage.includes('disabled')) {
      return 'Your account is currently disabled. Please contact support for assistance.';
    }
    
    if (lowerMessage.includes('rate limit') || lowerMessage.includes('too many')) {
      return 'Too many login attempts. Please wait a few minutes before trying again.';
    }
    
    // Return the original API message if it's user-friendly, otherwise use fallback
    if (apiMessage.length < 100 && !lowerMessage.includes('status code')) {
      return apiMessage;
    }
    
    return fallbackMessage;
  };

  const onSubmit = async (data: LoginFormData) => {
    setLoginError(null); // Clear previous errors
    
    try {
    switch (role) {
      case 'admin': {
        data.role = 'ADMIN';
          try {
            const result = await loginUser(data);
            
            if (result && typeof result === 'object' && 'success' in result && !result.success) {
              const errorMessage = formatLoginErrorMessage(
                result.message || '', 
                'Invalid username or password. Please check your credentials and try again.'
              );
              setLoginError(errorMessage);
              return;
            }
          
          const { tokens: { access_token, refresh_token } = {} as AuthTokens } = result;
        if (access_token) {
          const sessData = JSON.stringify({ role: 'admin', name: 'Amit' });
          sessionStorage.setItem(AppEnums.ACCESS_TOKEN, access_token);
          sessionStorage.setItem(AppEnums.REFRESH_TOKEN, refresh_token);
          sessionStorage.setItem(AppEnums.SUBADMIN_SESSION, sessData);
            notification.success(
              'Welcome Back!',
              'Admin login successful. Redirecting to dashboard...',
              { duration: 3000 }
            );
            setTimeout(() => navigate(AppRoute.ADMIN_SUBADMIN), 1000);
        } else {
            setLoginError('Login failed. Please check your credentials and try again.');
          }
          } catch (adminError) {
            console.error('Admin login error:', adminError);
            // Handle specific admin login errors without page refresh
            const errorMessage = formatLoginErrorMessage(
              '', 
              'Login failed. Please check your username and password and try again.'
            );
            setLoginError(errorMessage);
        }
        break;
      }
      case 'subadmin': {
        data.role = 'SUBADMIN';
          try {
            const result = (await loginUser(data)) as SubadminLoginResponse;
            
            if (result && typeof result === 'object' && 'success' in result && !result.success) {
              const errorMessage = formatLoginErrorMessage(
                result.message || '', 
                'Invalid username or password. Please check your credentials and try again.'
              );
              setLoginError(errorMessage);
              return;
            }
          
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
          } = result;
          
          if (access_token) {
        const logo = await getFileUrl(AWS_BUCKET_NAME, logoKey);
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
            notification.success(
              'Welcome Back!',
              'Subadmin login successful. Redirecting to dashboard...',
              { duration: 3000 }
            );
            setTimeout(() => navigate(AppRoute.SUBADMIN_DASHBOARD), 1000);
        } else {
            setLoginError('Login failed. Please check your credentials and try again.');
          }
          } catch (subadminError) {
            console.error('Subadmin login error:', subadminError);
            // Handle specific subadmin login errors without page refresh
            const errorMessage = formatLoginErrorMessage(
              '', 
              'Login failed. Please check your username and password and try again.'
            );
            setLoginError(errorMessage);
        }
        break;
      }
      case 'kyc': {
        data.role = 'KYC';
          setLoginError('KYC login is not implemented yet.');
        break;
      }
      default: {
          setLoginError('Please select a valid role to login.');
        break;
        }
      }
    } catch (error) {
      console.error('Unexpected login error:', error);
      // This should only catch truly unexpected errors (network issues, etc.)
      setLoginError('A network error occurred. Please check your connection and try again.');
    }
  };

  // Show welcome screen for first-time visitors (optional)
  if (showWelcome) {
    return <WelcomeScreen onGetStarted={() => setShowWelcome(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Mobile Header - Only visible on mobile */}
      <div className="lg:hidden gradient-bg-fundos px-4 py-6">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <h1 className="text-3xl font-bold text-white tracking-tight">
              Fund<span className="text-orange-300 font-light">OS</span>
            </h1>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Welcome!</h2>
          <p className="text-blue-100 text-lg">
            Start your investment journey with confidence
          </p>
        </div>
      </div>

      {/* Main Container */}
      <div className="min-h-screen lg:flex lg:items-center lg:justify-center lg:p-8">
        <div className="w-full max-w-6xl mx-auto">
          <div className="lg:grid lg:grid-cols-2 lg:gap-0 lg:rounded-2xl lg:overflow-hidden lg:shadow-2xl lg:bg-white">
            
            {/* Left Info Card - Hidden on mobile, visible on desktop */}
            <div className="hidden lg:block gradient-bg-fundos relative overflow-hidden">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative z-10 p-12 flex flex-col justify-center h-full min-h-[600px]">
                {/* Logo and Title */}
                <div className="mb-8">
                  <div className="flex items-center mb-6">
                    <h1 className="text-5xl font-bold text-white tracking-tight">
                      Fund<span className="text-orange-300 font-light">OS</span>
                    </h1>
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-4 leading-tight">
                    Welcome to the Future of Investment Management
                  </h2>
                  <p className="text-blue-100 text-lg leading-relaxed">
                    Access sophisticated investment tools and opportunities designed for serious investors and fund managers.
                  </p>
                </div>

                {/* Features List */}
                <div className="space-y-6 mb-8">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">✓</span>
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-lg">
                        Bank-Level Security
                      </h3>
                      <p className="text-blue-100 text-sm">
                        Your data is protected with encryption and multi-factor authentication
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">✓</span>
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-lg">
                        Real-time Analytics
                      </h3>
                      <p className="text-blue-100 text-sm">
                        Get instant insights and performance metrics for informed decisions
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">✓</span>
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-lg">
                        Seamless Operations
                      </h3>
                      <p className="text-blue-100 text-sm">
                        Streamlined workflows for efficient fund management
                      </p>
                    </div>
                  </div>
                </div>

                {/* Trust Indicators */}
                <div className="border-t border-white/20 pt-6">
                  <p className="text-blue-100 text-sm mb-3">Trusted by leading investment firms</p>
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-white text-sm font-medium">SEBI Registered</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-white text-sm font-medium">ISO 27001</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-white text-sm font-medium">24/7 Support</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Login Card */}
            <div className="bg-white lg:flex lg:items-center lg:justify-center">
              <div className="w-full max-w-md mx-auto px-4 py-6 lg:p-12">
        {!resetPassword ? (
                  <div className="space-y-8">
                    {/* Login Header */}
                    <div className="text-center lg:text-left">
                      <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 border border-blue-200 mb-6">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                        <span className="text-sm font-medium text-blue-700">
                          {colorScheme.name} Portal
                        </span>
                      </div>
                      <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-2">
                        Sign In
                      </h2>
                      <p className="text-slate-600">
                        Welcome back! Please enter your credentials to continue.
                      </p>
                    </div>

                    {/* Login Error Alert */}
                    {loginError && (
                      <ErrorAlert 
                        message={loginError} 
                        onDismiss={() => setLoginError(null)}
                        variant="error"
                        className="animate-slide-in"
                      />
                    )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Username Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="username"
                          className="text-slate-700 font-medium"
                >
                  Username
                </Label>
                <Input
                  id="username"
                          placeholder="Enter your username"
                          className="fundos-input h-12 text-base"
                  {...register('username', {
                    required: 'Username is required',
                  })}
                />
                {errors.username && (
                          <p className="text-red-500 text-sm flex items-center mt-1">
                            <span className="mr-1">⚠️</span>
                    {errors.username.message}
                  </p>
                )}
              </div>

              {/* Password Field */}
                      <div className="space-y-2">
                <Label
                  htmlFor="password"
                          className="text-slate-700 font-medium"
                >
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                            placeholder="Enter your password"
                            className="fundos-input h-12 text-base pr-12"
                    {...register('password', {
                      required: 'Password is required',
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && (
                          <p className="text-red-500 text-sm flex items-center mt-1">
                            <span className="mr-1">⚠️</span>
                    {errors.password.message}
                  </p>
                )}
              </div>

                      {/* Forgot Password Link */}
              {colorScheme.role !== 'admin' && (
                        <div className="text-right">
                          <button
                            type="button"
                  onClick={() => setResetPassword(true)}
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
                >
                            Forgot Password?
                          </button>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                        className="w-full h-12 fundos-btn-primary text-base font-semibold"
              >
                        Sign In to {colorScheme.name}
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
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Footer */}
      <div className="lg:hidden px-4 py-4 text-center">
        <p className="text-xs text-slate-500">
          © 2024 FundOS. All rights reserved.
        </p>
      </div>
    </div>
  );
}

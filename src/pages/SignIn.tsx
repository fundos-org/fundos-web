import { useForm } from 'react-hook-form';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CommonError, LoginFormData } from '@/constants/dealsConstant';
import { useEffect, useState } from 'react';
import { useAppDispatch } from '@/app/hooks';
import { loginAdmin, loginSubAdmin } from '@/axioscalls/dealApiServices';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

type ColorScheme = {
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
      background: 'bg-gradient-to-br from-blue-900 via-violet-700 to-white-900',
      cardBg: 'bg-yellow-100',
      inputBg: 'bg-light-800',
      inputText: 'text-black',
      inputBorder: 'border-cyan-500',
      focusRing: 'focus:ring-cyan-400',
      buttonBg: 'bg-gradient-to-r from-cyan-600 to-blue-600',
      buttonHover: 'hover:from-cyan-500 hover:to-blue-500',
      buttonText: 'text-white',
      starColor: 'bg-cyan-200',
    };
  } else if (hostname.includes('admin.fundos.services')) {
    return {
      name: 'Admin Portal',
      role: 'admin',
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
      name: 'FundOS',
      role: 'subadmin',
      background: 'bg-gradient-to-br from-gray-900 via-gray-800 to-black',
      cardBg: 'bg-zinc-900/40',
      inputBg: 'bg-gray-800',
      inputBorder: 'border-gray-600',
      inputText: 'text-white',
      focusRing: 'focus:ring-gray-500',
      buttonBg: 'bg-white',
      buttonHover: 'hover:bg-gray-200',
      buttonText: 'text-black',
      starColor: 'bg-white',
    };
  } else {
    return {
      name: 'FundOS',
      role: 'subadmin',
      background: 'bg-gradient-to-br from-gray-900 via-gray-800 to-black',
      cardBg: 'bg-zinc-900/40',
      inputBg: 'bg-gray-800',
      inputBorder: 'border-gray-600',
      inputText: 'text-white',
      focusRing: 'focus:ring-gray-500',
      buttonBg: 'bg-white',
      buttonHover: 'hover:bg-gray-200',
      buttonText: 'text-black',
      starColor: 'bg-white',
    };
    return {
      name: 'Admin Portal',
      role: 'admin',
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
  }
};

export default function SignIn() {
  const [role] = useState<'admin' | 'subadmin' | 'kyc'>(
    () => getColorScheme().role
  );
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const colorScheme = getColorScheme();

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

  useEffect(() => sessionStorage.clear(), []);

  const onSubmit = async (data: LoginFormData) => {
    switch (role) {
      case 'admin': {
        const { success, message } = await loginAdmin(data);
        if (success) {
          const sessData = JSON.stringify({ role: 'admin', name: 'Ammit' });
          sessionStorage.setItem('subadmindetails', sessData);
          toast.success(message || 'Login successful!');
          navigate('/subadmin');
        } else {
          toast.error('Unable to login. Please check once again!', {
            style: { borderRadius: 0 },
          });
        }
        break;
      }
      case 'subadmin': {
        dispatch(loginSubAdmin(data))
          .unwrap()
          .then(({ invite_code, name, subadmin_id, message }) => {
            const sessData = JSON.stringify({
              invite_code,
              name,
              subadmin_id,
              role: 'subadmin',
            });
            sessionStorage.setItem('subadmindetails', sessData);
            toast.success(message || 'Login successful!');
            navigate('/dashboard');
          })
          .catch((error: CommonError) => {
            toast.error(error.message || 'Login failed.');
          });
        break;
      }
      case 'kyc': {
        // Add your KYC login logic here if needed
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
      {/* <AdminToggle
        isAdmin={isAdmin}
        setIsAdmin={setIsAdmin}
        colorScheme={colorScheme}
      /> */}

      {/* Starry background effect with domain-specific colors */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className={`absolute w-2 h-2 ${colorScheme.starColor} rounded-full top-10 left-20 animate-twinkle`}
        />
        <div
          className={`absolute w-1 h-1 ${colorScheme.starColor} rounded-full top-20 right-30 animate-twinkle delay-1000`}
        />
        <div
          className={`absolute w-2 h-2 ${colorScheme.starColor} rounded-full bottom-40 left-40 animate-twinkle delay-500`}
        />
        <div
          className={`absolute w-1 h-1 ${colorScheme.starColor} rounded-full bottom-20 right-20 animate-twinkle delay-1500`}
        />
        <div
          className={`absolute w-2 h-2 ${colorScheme.starColor} rounded-full top-40 right-60 animate-twinkle delay-2000`}
        />
        <div
          className={`absolute w-1 h-1 ${colorScheme.starColor} rounded-full top-16 left-60 animate-twinkle delay-300`}
        />
        <div
          className={`absolute w-2 h-2 ${colorScheme.starColor} rounded-full bottom-60 right-40 animate-twinkle delay-1200`}
        />
        <div
          className={`absolute w-1 h-1 ${colorScheme.starColor} rounded-full top-80 left-10 animate-twinkle delay-1800`}
        />
        <div
          className={`absolute w-2 h-2 ${colorScheme.starColor} rounded-full bottom-10 left-80 animate-twinkle delay-600`}
        />
        <div
          className={`absolute w-1 h-1 ${colorScheme.starColor} rounded-full top-50 right-80 animate-twinkle delay-900`}
        />
        <div
          className={`absolute w-2 h-2 ${colorScheme.starColor} rounded-full bottom-30 left-30 animate-twinkle delay-2500`}
        />
        <div
          className={`absolute w-1 h-1 ${colorScheme.starColor} rounded-full top-30 right-10 animate-twinkle delay-400`}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center">
        {/* Logo - shows domain-specific name */}
        <h1 className="text-5xl font-bold text-white mb-10">
          {colorScheme.name}
        </h1>

        {/* Login Form */}
        <div
          className={`${colorScheme.cardBg} backdrop-blur-lg p-8 rounded-none shadow-lg w-[40rem] max-w-md border-[1px] border-gray-700`}
        >
          {/* <h2 className="text-2xl font-semibold text-white mb-2">Welcome!</h2> */}
          {/* <p className="text-gray-400 mb-6">Sign in to your account</p> */}

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
                {...register('username', { required: 'Username is required' })}
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
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className={`w-full mt-4 ${colorScheme.buttonBg} rounded-none ${colorScheme.buttonText || 'text-white'} ${colorScheme.buttonHover} font-semibold py-3`}
            >
              Login
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

// function getRoleByHostname(): 'admin' | 'subadmin' | 'kyc' {
//   const hostname = window.location.hostname;
//   if (hostname.includes('admin.fundos.services')) {
//     return 'admin';
//   } else if (hostname.includes('subadmin.fundos.services')) {
//     return 'subadmin';
//   } else if (hostname.includes('kyc.fundos.services')) {
//     return 'kyc';
//   } else {
//     return 'subadmin';
//   }
// }
// export function AdminToggle({
//   isAdmin,
//   setIsAdmin,
//   colorScheme,
// }: {
//   isAdmin: boolean;
//   setIsAdmin: Dispatch<SetStateAction<boolean>>;
//   colorScheme: ColorScheme;
// }) {
//   return (
//     <div className="flex items-center justify-center absolute top-10 right-10">
//       <div
//         className={`relative w-48 h-14 ${colorScheme.toggleBg} backdrop-blur-lg rounded-none flex items-center p-1 cursor-pointer border ${colorScheme.toggleBorder}`}
//         onClick={() => setIsAdmin(!isAdmin)}
//       >
//         {/* Sliding background with domain-specific gradient */}
//         <div
//           className={`absolute w-[calc(50%-0.5rem)] h-[2.5rem] ${colorScheme.toggleSlider} rounded-none transition-transform duration-300 ease-in-out shadow-md ${
//             isAdmin ? 'translate-x-1' : 'translate-x-[calc(100%+0.5rem)]'
//           }`}
//         >
//           {/* Tiny stars inside the sliding background */}
//           <div
//             className={`absolute w-1 h-1 ${colorScheme.starColor} rounded-full top-2 left-2 ${
//               isAdmin ? 'animate-twinkle' : 'animate-twinkle-fast'
//             }`}
//           />
//           <div
//             className={`absolute w-1 h-1 ${colorScheme.starColor} rounded-full bottom-2 right-2 ${
//               isAdmin
//                 ? 'animate-twinkle delay-500'
//                 : 'animate-twinkle-fast delay-300'
//             }`}
//           />
//         </div>

//         {/* Toggle options */}
//         <div className="relative flex w-full text-center text-sm font-semibold rounded-none">
//           <span
//             className={`w-1/2 z-10 transition-colors rounded-none duration-300 ${
//               isAdmin ? 'text-white' : 'text-gray-400'
//             }`}
//           >
//             Admin
//           </span>
//           <span
//             className={`w-1/2 z-10 transition-colors rounded-none duration-300 ${
//               !isAdmin ? 'text-white' : 'text-gray-400'
//             }`}
//           >
//             Subadmin
//           </span>
//         </div>
//       </div>
//     </div>
//   );
// }

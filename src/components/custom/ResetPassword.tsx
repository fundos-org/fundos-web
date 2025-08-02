import { ColorScheme } from '@/pages/SignIn';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ResetPasswordFormData } from '@/constants/dealsConstant';
import { ChevronLeft, Eye, EyeOff, X } from 'lucide-react';
import { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  resetPasswordAssign,
  resetPasswordRequest,
  resetPasswordVerify,
} from '@/axioscalls/apiServices';

const ResetPassword: FC<{
  colorScheme: ColorScheme;
  backToSignIn: () => void;
}> = ({ colorScheme, backToSignIn }) => {
  const [step, setStep] = useState<'email' | 'otp' | 'password'>('password');
  const [showPassword, setShowPassword] = useState(false);
  const [otpTimer, setOtpTimer] = useState(60);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [otpResendDisabled, setOtpResendDisabled] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    getValues,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    defaultValues: {
      email: '',
      otp: '',
      password: '',
      confirmPassword: '',
    },
  });

  // Timer for resend OTP
  useEffect(() => {
    if (step === 'otp' && otpResendDisabled) {
      timerRef.current = setInterval(() => {
        setOtpTimer(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setOtpResendDisabled(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [step, otpResendDisabled]);

  // Handlers
  const onSubmit = async (data: ResetPasswordFormData) => {
    if (step === 'email') {
      const res = await resetPasswordRequest(data.email);
      if (res.success) {
        setStep('otp');
        setOtpTimer(60);
        setOtpResendDisabled(true);
      } else {
        setError('email', { message: 'Failed to send OTP' });
      }
    } else if (step === 'otp') {
      const res = await resetPasswordVerify(data.email, data.otp);
      if (res.success) {
        setAccessToken(res?.tokens?.access_token);
        setStep('password');
      } else {
        setError('otp', { message: 'Invalid OTP' });
      }
    } else if (step === 'password') {
      if (data.password !== data.confirmPassword) {
        setError('confirmPassword', { message: 'Passwords do not match' });
        return;
      }
      const res = await resetPasswordAssign(data.password, accessToken!);
      if (res.success) {
        backToSignIn();
      } else {
        setError('password', { message: 'Failed to reset password' });
      }
    }
  };

  const handleResendOtp = async () => {
    const email = getValues('email');
    const res = await resetPasswordRequest(email);
    if (res.success) {
      setOtpTimer(60);
      setOtpResendDisabled(true);
      clearErrors('otp');
    }
  };

  const handleBack = () => {
    setStep(prev => {
      if (prev === 'otp') return 'email';
      if (prev === 'password') return 'otp';
      if (prev === 'email') {
        backToSignIn();
        return prev;
      }
      return prev;
    });
  };

  return (
    <div
      className={`${colorScheme.cardBg} backdrop-blur-lg p-8 rounded-none shadow-lg w-[40rem] max-w-md border-[1px] border-gray-700`}
    >
      <div className="flex items-center justify-between mb-5 mt-1">
        <div
          className="border-[1px] border-[#4b4b4b] bg-[#242325] cursor-pointer p-1"
          onClick={handleBack}
        >
          <ChevronLeft className="text-3xl font-bold cursor-pointer hover:opacity-50" />
        </div>
        <div
          className="border-[1px] border-[#4b4b4b] bg-[#242325] cursor-pointer p-1"
          onClick={backToSignIn}
        >
          <X className="text-3xl font-bold cursor-pointer hover:opacity-50" />
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Animate step transitions */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3 }}
          >
            {/* Email Field */}
            {step === 'email' && (
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-gray-400 text-sm uppercase"
                >
                  Email
                </Label>
                <Input
                  id="email"
                  placeholder="Enter email"
                  className={`${colorScheme.inputBg} ${colorScheme.inputText} rounded-none ${colorScheme.inputBorder} placeholder-gray-500 focus:ring-2 ${colorScheme.focusRing}`}
                  {...register('email', { required: 'Email is required' })}
                  autoFocus
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}
              </div>
            )}

            {/* OTP Field */}
            {step === 'otp' && (
              <div className="space-y-2">
                <Label
                  htmlFor="otp"
                  className="text-gray-400 text-sm uppercase"
                >
                  OTP
                </Label>
                <Input
                  minLength={6}
                  type="text"
                  maxLength={6}
                  id="otp"
                  placeholder="Enter OTP"
                  className={`${colorScheme.inputBg} ${colorScheme.inputText} rounded-none ${colorScheme.inputBorder} placeholder-gray-500 focus:ring-2 ${colorScheme.focusRing}`}
                  {...register('otp', { required: 'OTP is required' })}
                  autoFocus
                />
                {errors.otp && (
                  <p className="text-red-500 text-sm">{errors.otp.message}</p>
                )}
                <div className="flex items-center justify-end gap-2 mt-2">
                  {otpResendDisabled && (
                    <span className="text-gray-400 text-xs">
                      Resend in {otpTimer}s
                    </span>
                  )}
                  <Button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={otpResendDisabled}
                    className="rounded-none px-3 py-1 text-xs border border-[#4a4a4a] cursor-pointer"
                  >
                    Resend OTP
                  </Button>
                </div>
              </div>
            )}

            {/* Password Fields */}
            {step === 'password' && (
              <div className="space-y-2">
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
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-200"
                    tabIndex={-1}
                  >
                    {!showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={'password'}
                    placeholder="Confirm password"
                    className={`${colorScheme.inputBg} ${colorScheme.inputText} rounded-none ${colorScheme.inputBorder} placeholder-gray-500 focus:ring-2 ${colorScheme.focusRing} pr-10`}
                    {...register('confirmPassword', {
                      required: 'Confirm Password is required',
                    })}
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
        {/* Submit Button */}
        <Button
          type="submit"
          className={`w-full cursor-pointer ${colorScheme.buttonBg} rounded-none ${colorScheme.buttonText || 'text-white'} ${colorScheme.buttonHover} font-semibold py-3`}
        >
          {step === 'email'
            ? 'Send OTP'
            : step === 'otp'
              ? 'Verify OTP'
              : 'Reset Password'}
        </Button>
      </form>
    </div>
  );
};
export default ResetPassword;

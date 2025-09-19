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
import ErrorAlert from './ErrorAlert';
import { useNotification } from './NotificationProvider';

const ResetPassword: FC<{
  colorScheme: ColorScheme;
  backToSignIn: () => void;
}> = ({ backToSignIn }) => {
  const [step, setStep] = useState<'email' | 'otp' | 'password'>('email');
  const [showPassword, setShowPassword] = useState(false);
  const [otpTimer, setOtpTimer] = useState(60);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [otpResendDisabled, setOtpResendDisabled] = useState(true);
  const [currentError, setCurrentError] = useState<string | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const notification = useNotification();

  const {
    register,
    handleSubmit,
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

  // Helper function to format error messages for better UX
  const formatErrorMessage = (apiMessage: string, fallbackMessage: string) => {
    if (!apiMessage) return fallbackMessage;
    
    // Handle specific API error messages
    const lowerMessage = apiMessage.toLowerCase();
    
    if (lowerMessage.includes('no subadmin found')) {
      return 'No account found with this email address. Please check your email or contact support.';
    }
    
    if (lowerMessage.includes('invalid otp')) {
      return 'The verification code you entered is incorrect. Please check and try again.';
    }
    
    if (lowerMessage.includes('otp expired') || lowerMessage.includes('expired')) {
      return 'The verification code has expired. Please request a new one.';
    }
    
    if (lowerMessage.includes('rate limit') || lowerMessage.includes('too many')) {
      return 'Too many attempts. Please wait a few minutes before trying again.';
    }
    
    // Return the original API message if it's user-friendly, otherwise use fallback
    if (apiMessage.length < 100 && !lowerMessage.includes('status code')) {
      return apiMessage;
    }
    
    return fallbackMessage;
  };

  // Handlers
  const onSubmit = async (data: ResetPasswordFormData) => {
    setCurrentError(null); // Clear previous errors
    
    if (step === 'email') {
      const res = await resetPasswordRequest(data.email);
      if (res.success) {
        setStep('otp');
        setOtpTimer(60);
        setOtpResendDisabled(true);
        clearErrors('email');
        notification.success(
          'Verification Code Sent',
          'We\'ve sent a 6-digit verification code to your email address. Please check your inbox.',
          { duration: 6000 }
        );
      } else {
        const errorMessage = formatErrorMessage(
          res.message || '', 
          'Failed to send OTP. Please check your email address.'
        );
        setCurrentError(errorMessage);
      }
    } else if (step === 'otp') {
      const res = await resetPasswordVerify(data.email, data.otp);
      if (res.success) {
        setAccessToken(res?.tokens?.access_token || null);
        setStep('password');
        clearErrors('otp');
        notification.success(
          'Code Verified',
          'Verification successful! You can now create a new password.',
          { duration: 4000 }
        );
      } else {
        const errorMessage = formatErrorMessage(
          res.message || '', 
          'Invalid OTP. Please check and try again.'
        );
        setCurrentError(errorMessage);
      }
    } else if (step === 'password') {
      if (data.password !== data.confirmPassword) {
        setCurrentError('Passwords do not match. Please ensure both passwords are identical.');
        return;
      }
      const res = await resetPasswordAssign(data.password, accessToken!);
      if (res.success) {
        notification.success(
          'Password Updated',
          'Your password has been successfully updated. You can now sign in with your new password.',
          { duration: 5000 }
        );
        // Small delay to let user see the success message before redirecting
        setTimeout(() => {
          backToSignIn();
        }, 1500);
      } else {
        const errorMessage = formatErrorMessage(
          res.message || '', 
          'Failed to reset password. Please try again.'
        );
        setCurrentError(errorMessage);
      }
    }
  };

  const handleResendOtp = async () => {
    const email = getValues('email');
    setCurrentError(null); // Clear any existing errors
    const res = await resetPasswordRequest(email);
    if (res.success) {
      setOtpTimer(60);
      setOtpResendDisabled(true);
      clearErrors('otp');
      notification.info(
        'New Code Sent',
        'A new verification code has been sent to your email address.',
        { duration: 4000 }
      );
    } else {
      const errorMessage = formatErrorMessage(
        res.message || '', 
        'Failed to resend OTP. Please try again.'
      );
      setCurrentError(errorMessage);
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
    <div className="space-y-8">
      {/* Header with back button */}
      <div className="text-center lg:text-left">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={handleBack}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            <ChevronLeft size={20} className="text-slate-600" />
          </button>
          <h3 className="text-lg lg:text-xl font-semibold text-slate-700">
            {step === 'email' ? 'Reset Password' : 
             step === 'otp' ? 'Verify Code' : 'New Password'}
          </h3>
          <button
            onClick={backToSignIn}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            <X size={20} className="text-slate-600" />
          </button>
        </div>
        <p className="text-slate-600 mb-6">
          {step === 'email' ? 'Enter your email to receive a reset code' :
           step === 'otp' ? 'Enter the verification code sent to your email' :
           'Create a new secure password'}
        </p>
      </div>

      {/* Error Alert */}
      {currentError && (
        <ErrorAlert 
          message={currentError} 
          onDismiss={() => setCurrentError(null)}
          variant="error"
        />
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Animate step transitions */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {/* Email Field */}
            {step === 'email' && (
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700 font-medium">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  className="fundos-input h-12 text-base"
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Please enter a valid email address'
                    }
                  })}
                  autoFocus
                />
                {errors.email && (
                  <p className="text-red-500 text-sm flex items-center mt-1">
                    <span className="mr-1">⚠️</span>
                    {errors.email.message}
                  </p>
                )}
                <p className="text-sm text-slate-500 mt-2">
                  We'll send a verification code to your email address.
                </p>
              </div>
            )}

            {/* OTP Field */}
            {step === 'otp' && (
              <div className="space-y-2">
                <Label htmlFor="otp" className="text-slate-700 font-medium">
                  Verification Code
                </Label>
                <Input
                  minLength={6}
                  type="text"
                  maxLength={6}
                  id="otp"
                  placeholder="Enter 6-digit code"
                  className="fundos-input h-12 text-base text-center tracking-wider"
                  {...register('otp', { required: 'Verification code is required' })}
                  autoFocus
                />
                {errors.otp && (
                  <p className="text-red-500 text-sm flex items-center mt-1">
                    <span className="mr-1">⚠️</span>
                    {errors.otp.message}
                  </p>
                )}
                <div className="flex items-center justify-between mt-3">
                  <p className="text-sm text-slate-500">
                    Didn't receive the code?
                  </p>
                  <div className="flex items-center gap-2">
                    {otpResendDisabled && (
                      <span className="text-sm text-slate-400">
                        Resend in {otpTimer}s
                      </span>
                    )}
                    <Button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={otpResendDisabled}
                      variant="outline"
                      size="sm"
                    >
                      Resend Code
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Password Fields */}
            {step === 'password' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-slate-700 font-medium">
                    New Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter new password"
                      className="fundos-input h-12 text-base pr-12"
                      {...register('password', {
                        required: 'Password is required',
                        minLength: {
                          value: 8,
                          message: 'Password must be at least 8 characters'
                        }
                      })}
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 transition-colors"
                      tabIndex={-1}
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
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-slate-700 font-medium">
                    Confirm Password
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm new password"
                    className="fundos-input h-12 text-base"
                    {...register('confirmPassword', {
                      required: 'Please confirm your password',
                    })}
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm flex items-center mt-1">
                      <span className="mr-1">⚠️</span>
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
        
        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full h-12 fundos-btn-primary text-base font-semibold"
        >
          {step === 'email'
            ? 'Send Verification Code'
            : step === 'otp'
              ? 'Verify Code'
              : 'Update Password'}
        </Button>
      </form>
    </div>
  );
};
export default ResetPassword;

import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { getRandomCode } from '@/lib/randomInviteCodeGenertor';
import { useNotification } from '@/components/custom/NotificationProvider';
import { Button } from '@/components/ui/button';
import {
  Copy,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Loader2,
} from 'lucide-react';
import { validateFields } from '@/axioscalls/apiServices';

const StepSubAdmin2: React.FC = () => {
  const {
    register,
    formState: { errors },
    getValues,
    setValue,
    watch,
    setError,
    clearErrors,
  } = useFormContext();

  const [code, setCode] = useState<string>('');
  const username = watch('username');
  const appname = watch('appname');
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<null | boolean>(
    null
  );
  const [isCheckingApp, setIsCheckingApp] = useState(false);
  const [appAvailable, setAppAvailable] = useState<null | boolean>(null);
  const notification = useNotification();

  // Generate random code on component mount
  useEffect(() => {
    const newCode = getRandomCode();
    setCode(newCode);
    setValue('invitecode', newCode, { shouldValidate: true });
  }, [setValue]);

  // Handle generating new code
  const handleGenerateNewCode = () => {
    const newCode = getRandomCode();
    setCode(newCode);
    setValue('invitecode', newCode, { shouldValidate: true });
  };

  // Handle copying code to clipboard
  const handleCopyCode = () => {
    navigator.clipboard
      .writeText(code)
      .then(() => {
        notification.success(
          'Code Copied',
          'Invite code has been copied to clipboard!',
          { duration: 3000 }
        );
      })
      .catch(() => {
        notification.error(
          'Copy Failed',
          'Failed to copy code. Please try again.',
          { duration: 3000 }
        );
      });
  };

  // Debounced username uniqueness validation
  useEffect(() => {
    if (!username) return;
    setIsCheckingUsername(true);
    setUsernameAvailable(null);
    const current = username as string;
    const handle = setTimeout(async () => {
      try {
        const available = await validateFields('username', current);
        if (available === false) {
          setError('username', {
            type: 'server',
            message: 'Username already in use',
          });
          setUsernameAvailable(false);
        } else if (errors.username && errors.username.type === 'server') {
          clearErrors('username');
          setUsernameAvailable(true);
        } else {
          setUsernameAvailable(true);
        }
      } catch {
        // Ignore server errors for debounced validation
      } finally {
        // prevent race condition: ensure value hasn't changed
        if (current === getValues('username')) {
          setIsCheckingUsername(false);
        }
      }
    }, 300);
    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username]);

  // Debounced app name uniqueness validation
  useEffect(() => {
    if (!appname) return;
    setIsCheckingApp(true);
    setAppAvailable(null);
    // App name is normalized to lowercase and without separators already
    const current = appname as string;
    const handle = setTimeout(async () => {
      try {
        const available = await validateFields('app_name', current);
        if (available === false) {
          setError('appname', {
            type: 'server',
            message: 'App name already in use',
          });
          setAppAvailable(false);
        } else if (errors.appname && errors.appname.type === 'server') {
          clearErrors('appname');
          setAppAvailable(true);
        } else {
          setAppAvailable(true);
        }
      } catch {
        // Ignore server errors for debounced validation
      } finally {
        if (current === getValues('appname')) {
          setIsCheckingApp(false);
        }
      }
    }, 300);
    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appname]);

  // Re-validate on mount to restore server errors after rerenders/unmounts
  useEffect(() => {
    const restore = async () => {
      if (username) {
        try {
          const available = await validateFields('username', String(username));
          if (available === false) {
            setError('username', {
              type: 'server',
              message: 'Username already in use',
            });
            setUsernameAvailable(false);
          } else {
            setUsernameAvailable(true);
          }
        } catch {
          // ignore restore validation failure
        }
      }
      if (appname) {
        try {
          const available = await validateFields('app_name', String(appname));
          if (available === false) {
            setError('appname', {
              type: 'server',
              message: 'App name already in use',
            });
            setAppAvailable(false);
          } else {
            setAppAvailable(true);
          }
        } catch {
          // ignore restore validation failure
        }
      }
    };
    restore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="username" className="text-sm font-medium text-gray-700">
            Username<span className="text-red-500">*</span>
          </Label>
          <div className="flex items-center gap-2 text-sm">
            {isCheckingUsername && (
              <span className="flex items-center gap-1 text-gray-500">
                <Loader2 className="h-4 w-4 animate-spin" />
                Checking...
              </span>
            )}
            {!isCheckingUsername && username && usernameAvailable === true && (
              <span className="flex items-center gap-1 text-green-600">
                <CheckCircle2 className="h-4 w-4" />
                Available
              </span>
            )}
            {!isCheckingUsername && username && usernameAvailable === false && (
              <span className="flex items-center gap-1 text-red-500">
                <AlertTriangle className="h-4 w-4" />
                Already exists
              </span>
            )}
          </div>
        </div>
        <Input
          id="username"
          {...register('username', {
            required: 'Username is required',
            minLength: {
              value: 3,
              message: 'Username must be at least 3 characters',
            },
          })}
          placeholder="Enter username"
          className="rounded-lg bg-white text-gray-900 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-colors"
        />
        {errors.username && (
          <p className="text-red-500 text-sm flex items-center mt-1">
            <span className="mr-1">⚠️</span>
            {String(errors.username.message)}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-sm font-medium text-gray-700">
          Password<span className="text-red-500">*</span>
        </Label>
        <Input
          id="password"
          type="password"
          {...register('password', {
            required: 'Password is required',
            minLength: {
              value: 8,
              message: 'Password must be at least 8 characters',
            },
          })}
          placeholder="Enter password"
          className="rounded-lg bg-white text-gray-900 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-colors"
        />
        {errors.password && (
          <p className="text-red-500 text-sm flex items-center mt-1">
            <span className="mr-1">⚠️</span>
            {String(errors.password.message)}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="reenterpassword" className="text-sm font-medium text-gray-700">
          Confirm Password<span className="text-red-500">*</span>
        </Label>
        <Input
          id="reenterpassword"
          type="password"
          {...register('reenterpassword', {
            required: 'Please confirm password',
            validate: value =>
              value === getValues('password') || 'Passwords do not match',
          })}
          placeholder="Re-enter password"
          className="rounded-lg bg-white text-gray-900 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-colors"
        />
        {errors.reenterpassword && (
          <p className="text-red-500 text-sm flex items-center mt-1">
            <span className="mr-1">⚠️</span>
            {String(errors.reenterpassword.message)}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="appname" className="text-sm font-medium text-gray-700">
            App Name<span className="text-red-500">*</span>
          </Label>
          <div className="flex items-center gap-2 text-sm">
            {isCheckingApp && (
              <span className="flex items-center gap-1 text-gray-500">
                <Loader2 className="h-4 w-4 animate-spin" />
                Checking...
              </span>
            )}
            {!isCheckingApp && appname && appAvailable === true && (
              <span className="flex items-center gap-1 text-green-600">
                <CheckCircle2 className="h-4 w-4" />
                Available
              </span>
            )}
            {!isCheckingApp && appname && appAvailable === false && (
              <span className="flex items-center gap-1 text-red-500">
                <AlertTriangle className="h-4 w-4" />
                Already exists
              </span>
            )}
          </div>
        </div>
        <Input
          id="appname"
          {...register('appname', {
            required: 'App name is required',
            pattern: {
              value: /^[a-zA-Z0-9]*$/,
              message: 'App name cannot contain -, _, or spaces',
            },
            setValueAs: value => value.toLowerCase().replace(/[-_\s]/g, ''),
          })}
          placeholder="Enter app name"
          className="rounded-lg bg-white text-gray-900 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-colors"
        />
        {errors.appname && (
          <p className="text-red-500 text-sm flex items-center mt-1">
            <span className="mr-1">⚠️</span>
            {String(errors.appname.message)}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="invitecode" className="text-sm font-medium text-gray-700">
          Invite Code<span className="text-red-500">*</span>
        </Label>
        <div className="relative">
          <Input
            value={code}
            disabled
            id="invitecode"
            {...register('invitecode', { required: 'Invite code is required' })}
            className="pr-20 bg-gray-50 text-gray-900 rounded-lg border-gray-300 w-full"
          />
          <div className="absolute right-1 top-1/2 transform -translate-y-1/2 flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleGenerateNewCode}
              className="h-8 w-8 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-md transition-colors"
              title="Generate new code"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCopyCode}
              className="h-8 w-8 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-md transition-colors"
              title="Copy code"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepSubAdmin2;

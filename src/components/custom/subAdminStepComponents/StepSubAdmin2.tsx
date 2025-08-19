import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { getRandomCode } from '@/lib/randomInviteCodeGenertor';
import toast from 'react-hot-toast';
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
        toast.success('Code copied to clipboard!');
      })
      .catch(() => {
        toast.error('Failed to copy code.');
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
    <div className="grid gap-4">
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="username" className="text-white">
            Username
          </Label>
          <div className="flex items-center gap-2 text-sm">
            {isCheckingUsername && (
              <span className="flex items-center gap-1 text-gray-400">
                <Loader2 className="h-4 w-4 animate-spin" />
                Checking...
              </span>
            )}
            {!isCheckingUsername && username && usernameAvailable === true && (
              <span className="flex items-center gap-1 text-green-500">
                <CheckCircle2 className="h-4 w-4" />
                {String(username)} available
              </span>
            )}
            {!isCheckingUsername && username && usernameAvailable === false && (
              <span className="flex items-center gap-1 text-yellow-400">
                <AlertTriangle className="h-4 w-4" />
                {String(username)} already exists
              </span>
            )}
          </div>
        </div>
        <div className="relative">
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
            className="rounded-none text-white"
          />
        </div>
        {errors.username && (
          <p className="text-red-400 text-sm">
            {String(errors.username.message)}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="password" className="text-right text-white">
          Password
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
          className="rounded-none text-white"
        />
        {errors.password && (
          <p className="text-red-400 text-sm">
            {String(errors.password.message)}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="reenterpassword" className="text-right text-white">
          Re-enter Password
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
          className="rounded-none text-white"
        />
        {errors.reenterpassword && (
          <p className="text-red-400 text-sm">
            {String(errors.reenterpassword.message)}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="appname" className="text-white">
            App Name
          </Label>
          <div className="flex items-center gap-2 text-sm">
            {isCheckingApp && (
              <span className="flex items-center gap-1 text-gray-400">
                <Loader2 className="h-4 w-4 animate-spin" />
                Checking...
              </span>
            )}
            {!isCheckingApp && appname && appAvailable === true && (
              <span className="flex items-center gap-1 text-green-500">
                <CheckCircle2 className="h-4 w-4" />
                {String(appname)} available
              </span>
            )}
            {!isCheckingApp && appname && appAvailable === false && (
              <span className="flex items-center gap-1 text-yellow-400">
                <AlertTriangle className="h-4 w-4" />
                {String(appname)} already exists
              </span>
            )}
          </div>
        </div>
        <div className="relative">
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
            className="rounded-none text-white"
          />
        </div>
        {errors.appname && (
          <p className="text-red-400 text-sm">
            {String(errors.appname.message)}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2 w-full">
        <Label htmlFor="invitecode" className="text-right text-white">
          Invite Code
        </Label>
        <div className="relative w-full">
          <Input
            value={code}
            disabled
            id="invitecode"
            {...register('invitecode', { required: 'Invite code is required' })}
            className="pr-20 bg-gray-800 text-white rounded-none w-full"
          />
          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleGenerateNewCode}
              className="h-8 w-8 text-gray-400 rounded-none"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCopyCode}
              className="h-8 w-8 text-gray-400 rounded-none"
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

import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { getRandomCode } from '@/lib/randomInviteCodeGenertor';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Copy, RefreshCw } from 'lucide-react';

const StepSubAdmin2: React.FC = () => {
  const {
    register,
    formState: { errors },
    getValues,
    setValue,
  } = useFormContext();

  const [code, setCode] = useState<string>('');

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

  return (
    <div className="grid gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="username" className="text-right text-white">
          Username
        </Label>
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
        <Label htmlFor="appname" className="text-right text-white">
          App Name
        </Label>
        <Input
          id="appname"
          {...register('appname', {
            required: 'App name is required',
            pattern: {
              value: /^[a-zA-Z0-9]*$/, // Allows only alphanumeric characters
              message: 'App name cannot contain -, _, or spaces',
            },
            setValueAs: value => value.toLowerCase(), // Converts input to lowercase
          })}
          placeholder="Enter app name"
          className="rounded-none text-white"
          onChange={e => {
            e.target.value = e.target.value
              .replace(/[-_\s]/g, '') // Remove -, _, and spaces
              .toLowerCase(); // Convert to lowercase
          }}
        />
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

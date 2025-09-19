import { Input } from '@/components/ui/input';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dispatch, SetStateAction, useMemo } from 'react';
import { SubadminDetailsResponse } from '@/constants/dealsConstant';
import { Button } from '@/components/ui/button';

// Define the props interface
interface LoginDetailsProps {
  data: Partial<SubadminDetailsResponse>;
  setDialogOpen: Dispatch<SetStateAction<string | null>>;
  handleUpdateDetails?: (value: Partial<SubadminDetailsResponse>) => void;
}

// Define the form schema with zod
const schema = z
  .object({
    username: z.string().min(1, { message: 'Username is required' }).optional(),
    password: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters' })
      .optional(),
    reenter_password: z
      .string()
      .min(6, { message: 'Re-enter password must be at least 6 characters' })
      .optional(),
    app_name: z.string().min(1, { message: 'App name is required' }).optional(),
    invite_code: z
      .string()
      .min(1, { message: 'Invite code is required' })
      .optional(),
    app_theme: z
      .string()
      .min(1, { message: 'App theme is required' })
      .optional(),
  })
  .refine(data => data.password === data.reenter_password, {
    message: 'Passwords must match',
    path: ['reenter_password'],
  });

type FormData = z.infer<typeof schema>;

const LoginDetails: React.FC<LoginDetailsProps> = ({
  data,
  setDialogOpen,
  handleUpdateDetails,
}) => {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      username: data?.username || '',
      password: data?.password || '',
      reenter_password: data?.reenter_password || '',
      app_name: data?.app_name || '',
      invite_code: data?.invite_code || '',
      app_theme: data?.app_theme || '',
    },
  });

  // Watch all form values to detect changes
  const watchedValues = watch();

  // Check if form has been modified
  const hasChanges = useMemo(() => {
    return (
      watchedValues.username !== (data?.username || '') ||
      watchedValues.password !== (data?.password || '') ||
      watchedValues.reenter_password !== (data?.reenter_password || '') ||
      watchedValues.app_name !== (data?.app_name || '') ||
      watchedValues.invite_code !== (data?.invite_code || '') ||
      watchedValues.app_theme !== (data?.app_theme || '')
    );
  }, [watchedValues, data]);

  const onSubmit = ({
    username,
    password,
    reenter_password,
    app_name,
    invite_code,
    app_theme,
  }: FormData) => {
    handleUpdateDetails?.({
      username,
      password,
      reenter_password,
      app_name,
      invite_code,
      app_theme,
    });
  };

  return (
    <div className="w-full h-full flex flex-col">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col h-full"
      >
        <div className="flex-1 space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <Controller
              name="username"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Enter username"
                  className={`${errors.username ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'} rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-colors`}
                />
              )}
            />
            {errors.username && (
              <p className="text-red-500 text-sm flex items-center mt-1">
                <span className="mr-1">⚠️</span>
                {errors.username.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="password"
                  placeholder="Enter password"
                  className={`${errors.password ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'} rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-colors`}
                />
              )}
            />
            {errors.password && (
              <p className="text-red-500 text-sm flex items-center mt-1">
                <span className="mr-1">⚠️</span>
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <Controller
              name="reenter_password"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="password"
                  placeholder="Re-enter password"
                  className={`${errors.reenter_password ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'} rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-colors`}
                />
              )}
            />
            {errors.reenter_password && (
              <p className="text-red-500 text-sm flex items-center mt-1">
                <span className="mr-1">⚠️</span>
                {errors.reenter_password.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              App Name
            </label>
            <Controller
              name="app_name"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Enter app name"
                  className={`${errors.app_name ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'} rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-colors`}
                />
              )}
            />
            {errors.app_name && (
              <p className="text-red-500 text-sm flex items-center mt-1">
                <span className="mr-1">⚠️</span>
                {errors.app_name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Invite Code
            </label>
            <Controller
              name="invite_code"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Enter invite code"
                  className={`${errors.invite_code ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'} rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-colors`}
                />
              )}
            />
            {errors.invite_code && (
              <p className="text-red-500 text-sm flex items-center mt-1">
                <span className="mr-1">⚠️</span>
                {errors.invite_code.message}
              </p>
            )}
          </div>

          {/* <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              App Theme
            </label>
            <Controller
              name="app_theme"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="App Theme"
                  className={`${errors.app_theme ? 'border-red-500' : ''} rounded-none w-full bg-gray-700 text-white border-gray-600 focus:border-gray-400`}
                />
              )}
            />
            {errors.app_theme && (
              <p className="text-red-500 text-sm">{errors.app_theme.message}</p>
            )}
          </div> */}
        </div>

        <div className="border-t border-gray-200 bg-gray-50 p-4 mt-6">
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              onClick={() => setDialogOpen(null)}
              className="border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 rounded-lg px-6 py-2.5 font-medium transition-colors"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!hasChanges}
              className={`rounded-lg px-6 py-2.5 font-medium transition-colors ${
                hasChanges
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default LoginDetails;

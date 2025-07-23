import { Input } from '@/components/ui/input';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dispatch, SetStateAction } from 'react';
import { SubadminDetailsResponse } from '@/constants/dealsConstant';

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
    <div className="text-white p-6 m-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 h-full flex flex-col justify-between gap-2"
      >
        <div className="flex flex-col gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Username
            </label>
            <Controller
              name="username"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Username"
                  className={`${errors.username ? 'border-red-500' : ''} rounded-none w-full bg-gray-700 text-white border-gray-600 focus:border-gray-400`}
                />
              )}
            />
            {errors.username && (
              <p className="text-red-500 text-sm">{errors.username.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Password
            </label>
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="password"
                  placeholder="Password"
                  className={`${errors.password ? 'border-red-500' : ''} rounded-none w-full bg-gray-700 text-white border-gray-600 focus:border-gray-400`}
                />
              )}
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Re-enter Password
            </label>
            <Controller
              name="reenter_password"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="password"
                  placeholder="Re-enter Password"
                  className={`${errors.reenter_password ? 'border-red-500' : ''} rounded-none w-full bg-gray-700 text-white border-gray-600 focus:border-gray-400`}
                />
              )}
            />
            {errors.reenter_password && (
              <p className="text-red-500 text-sm">
                {errors.reenter_password.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              App Name
            </label>
            <Controller
              name="app_name"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="App Name"
                  className={`${errors.app_name ? 'border-red-500' : ''} rounded-none w-full bg-gray-700 text-white border-gray-600 focus:border-gray-400`}
                />
              )}
            />
            {errors.app_name && (
              <p className="text-red-500 text-sm">{errors.app_name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Invite Code
            </label>
            <Controller
              name="invite_code"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Invite Code"
                  className={`${errors.invite_code ? 'border-red-500' : ''} rounded-none w-full bg-gray-700 text-white border-gray-600 focus:border-gray-400`}
                />
              )}
            />
            {errors.invite_code && (
              <p className="text-red-500 text-sm">
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

        <div className="flex gap-3 justify-end">
          <button
            onClick={() => setDialogOpen(null)}
            type="button"
            className="bg-[#383739] text-white hover:opacity-50 px-10 py-2 cursor-pointer"
          >
            Close
          </button>
          <button
            type="submit"
            className="bg-white text-black hover:opacity-50 px-10 py-2 cursor-pointer"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginDetails;

import { Input } from '@/components/ui/input';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dispatch, SetStateAction, useMemo } from 'react';
import { SubadminDetailsResponse } from '@/constants/dealsConstant';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

// Define the props interface
interface ProfileDetailsProps {
  data: Partial<SubadminDetailsResponse>;
  setDialogOpen: Dispatch<SetStateAction<string | null>>;
  handleUpdateDetails: (value: Partial<SubadminDetailsResponse>) => void;
}

// Define the form schema with zod
const schema = z.object({
  logo: z.string({ message: 'Logo is required' }).optional(),
  name: z.string().min(1, { message: 'Name is required' }).optional(),
  email: z.email({ message: 'Invalid email' }).optional(),
  contact: z
    .string()
    .min(10, { message: 'Contact number must be at least 10 digits' })
    .optional(),
  about: z.string({ message: 'About is needed' }).optional(),
});

type FormData = z.infer<typeof schema>;

const ProfileDetails: React.FC<ProfileDetailsProps> = ({
  data: { logo, name, email, contact, about },
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
      name: name || '',
      email: email || '',
      contact: contact || '',
      about: about || '',
      logo: logo || '',
    },
  });

  // Watch all form values to detect changes
  const watchedValues = watch();

  // Check if form has been modified
  const hasChanges = useMemo(() => {
    return (
      watchedValues.name !== (name || '') ||
      watchedValues.email !== (email || '') ||
      watchedValues.contact !== (contact || '') ||
      watchedValues.about !== (about || '')
    );
  }, [watchedValues, name, email, contact, about]);

  const onSubmit = ({ name, email, contact }: FormData) => {
    handleUpdateDetails?.({ logo, name, email, contact, about });
  };

  return (
    <div className="w-full h-full flex flex-col">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col h-full"
      >
        <div className="flex-1 space-y-6">
          <div className="flex items-center space-x-4">
            <img
              src={logo}
              alt={`${name}'s profile`}
              className="w-20 h-20 object-cover border-2 border-gray-200 rounded-lg"
            />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Profile Picture</h3>
              <p className="text-sm text-gray-500">This is the current logo for the sub admin</p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Syndicate Name
            </label>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Enter syndicate name"
                  className={`${errors.name ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'} rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-colors`}
                />
              )}
            />
            {errors.name && (
              <p className="text-red-500 text-sm flex items-center mt-1">
                <span className="mr-1">⚠️</span>
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="email"
                  placeholder="Enter email address"
                  className={`${errors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'} rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-colors`}
                />
              )}
            />
            {errors.email && (
              <p className="text-red-500 text-sm flex items-center mt-1">
                <span className="mr-1">⚠️</span>
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Contact Number
            </label>
            <Controller
              name="contact"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Enter contact number"
                  className={`${errors.contact ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'} rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-colors`}
                />
              )}
            />
            {errors.contact && (
              <p className="text-red-500 text-sm flex items-center mt-1">
                <span className="mr-1">⚠️</span>
                {errors.contact.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              About
            </label>
            <Controller
              name="about"
              control={control}
              render={({ field }) => (
                <Textarea
                  {...field}
                  placeholder="Enter description about the sub admin"
                  rows={4}
                  className={`${errors.about ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'} rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-colors resize-none`}
                />
              )}
            />
            {errors.about && (
              <p className="text-red-500 text-sm flex items-center mt-1">
                <span className="mr-1">⚠️</span>
                {errors?.about?.message}
              </p>
            )}
          </div>
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

export default ProfileDetails;

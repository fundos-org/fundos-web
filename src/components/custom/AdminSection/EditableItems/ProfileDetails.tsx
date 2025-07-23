import { Input } from '@/components/ui/input';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dispatch, SetStateAction } from 'react';
import { SubadminDetailsResponse } from '@/constants/dealsConstant';
import { Textarea } from '@/components/ui/textarea';

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

  const onSubmit = ({ name, email, contact }: FormData) => {
    handleUpdateDetails?.({ logo, name, email, contact, about });
  };

  return (
    <div className="text-white border-0 mx-7 my-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 h-full flex flex-col justify-between gap-2"
      >
        <div className="flex flex-col gap-5">
          <img
            src={logo}
            alt={`${name}'s profile`}
            className="w-15 h-15 object-cover border-2 border-gray-600"
          />

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Name
            </label>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Name"
                  className={`${errors.name ? 'border-red-500' : ''} rounded-none w-full bg-gray-700 text-white border-gray-600 focus:border-gray-400`}
                />
              )}
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Email
            </label>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Email"
                  className={`${errors.email ? 'border-red-500' : ''} rounded-none w-full bg-gray-700 text-white border-gray-600 focus:border-gray-400`}
                />
              )}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Contact
            </label>
            <Controller
              name="contact"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Contact Number"
                  className={`${errors.contact ? 'border-red-500' : ''} rounded-none w-full bg-gray-700 text-white border-gray-600 focus:border-gray-400`}
                />
              )}
            />
            {errors.contact && (
              <p className="text-red-500 text-sm">{errors.contact.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              About
            </label>
            <Controller
              name="about"
              control={control}
              render={({ field }) => (
                <Textarea
                  {...field}
                  placeholder="About"
                  className={`${errors.about ? 'border-red-500' : ''} rounded-none w-full bg-gray-700 text-white border-gray-600 focus:border-gray-400`}
                />
              )}
            />
            {errors.about && (
              <p className="text-red-500 text-sm">{errors?.about?.message}</p>
            )}
          </div>
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

export default ProfileDetails;

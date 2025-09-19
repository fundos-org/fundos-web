import { Input } from '@/components/ui/input';
import {
  PersonalDetails as PDType,
  UpdateInvestorRequest,
} from '@/constants/membersConstant';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dispatch, SetStateAction } from 'react';

const schema = z.object({
  first_name: z
    .string()
    .min(1, { message: 'First name is required' })
    .optional(),
  last_name: z.string().min(1, { message: 'Last name is required' }).optional(),
  email: z.string().email({ message: 'Invalid email' }).optional(),
  phone_number: z
    .string()
    .min(10, { message: 'Phone number must be at least 10 digits' })
    .optional(),
  pan_number: z
    .string()
    .min(10, { message: 'PAN number must be 10 characters' })
    .optional(),
  aadhaar_number: z
    .string()
    .min(12, { message: 'Aadhaar number must be 12 digits' })
    .optional(),
});

type FormData = z.infer<typeof schema>;

const PersonalDetails: React.FC<{
  details: PDType;
  setDialogOpen: Dispatch<SetStateAction<boolean>>;
  handleUpdateDetails: (value: UpdateInvestorRequest) => void;
}> = ({ details, setDialogOpen, handleUpdateDetails }) => {
  const {
    control,
    handleSubmit,
    formState: { errors, dirtyFields },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      first_name: details?.first_name || '',
      last_name: details?.last_name || '',
      email: details?.email || '',
      phone_number: details?.phone_number || '',
      pan_number: details?.pan_number || 'KIXSP7327X',
      aadhaar_number: details?.aadhaar_number || '900492462643',
    },
  });

  // Check if any fields have been modified
  const hasChanges = Object.keys(dirtyFields).length > 0;

  const onSubmit = ({ first_name, last_name }: FormData) => {
    if (!hasChanges) return;
    console.log({ first_name, last_name });
    handleUpdateDetails({ first_name, last_name });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 px-10 py-5 h-full flex flex-col justify-between gap-2"
    >
      <div className="flex flex-col gap-5">
        <div className="flex space-x-4">
          <div className="w-1/2">
            <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
              First Name
            </label>
            <Controller
              name="first_name"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Enter first name"
                  className={`bg-gray-50 border border-gray-200 text-gray-900 px-4 py-3 rounded-lg ${errors.first_name ? 'border-red-500' : ''}`}
                />
              )}
            />
            {errors.first_name && (
              <p className="text-red-500 text-sm">
                {errors.first_name.message}
              </p>
            )}
          </div>
          <div className="w-1/2">
            <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
              Last Name
            </label>
            <Controller
              name="last_name"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Enter last name"
                  className={`bg-gray-50 border border-gray-200 text-gray-900 px-4 py-3 rounded-lg ${errors.last_name ? 'border-red-500' : ''}`}
                />
              )}
            />
            {errors.last_name && (
              <p className="text-red-500 text-sm">{errors.last_name.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
            E-Mail ID
          </label>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                disabled
                placeholder="Enter email address"
                className={`bg-gray-100 border border-gray-200 text-gray-500 px-4 py-3 rounded-lg cursor-not-allowed ${errors.email ? 'border-red-500' : ''}`}
              />
            )}
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
            Phone Number
          </label>
          <Controller
            name="phone_number"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                disabled
                placeholder="Enter phone number"
                className={`bg-gray-100 border border-gray-200 text-gray-500 px-4 py-3 rounded-lg cursor-not-allowed ${errors.phone_number ? 'border-red-500' : ''}`}
              />
            )}
          />
          {errors.phone_number && (
            <p className="text-red-500 text-sm">
              {errors.phone_number.message}
            </p>
          )}
        </div>

        <div>
          <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
            PAN Number
          </label>
          <Controller
            name="pan_number"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                disabled
                placeholder="Enter PAN number"
                className={`bg-gray-100 border border-gray-200 text-gray-500 px-4 py-3 rounded-lg cursor-not-allowed ${errors.pan_number ? 'border-red-500' : ''}`}
              />
            )}
          />
          {errors.pan_number && (
            <p className="text-red-500 text-sm">{errors.pan_number.message}</p>
          )}
        </div>

        <div>
          <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
            Aadhaar Number
          </label>
          <Controller
            name="aadhaar_number"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                disabled
                placeholder="Enter Aadhaar number"
                className={`bg-gray-100 border border-gray-200 text-gray-500 px-4 py-3 rounded-lg cursor-not-allowed ${errors.aadhaar_number ? 'border-red-500' : ''}`}
              />
            )}
          />
          {errors.aadhaar_number && (
            <p className="text-red-500 text-sm">
              {errors.aadhaar_number.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex gap-3 justify-end mt-8 pt-6 border-t border-gray-200">
        <button
          onClick={() => setDialogOpen(false)}
          type="button"
          className="border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 rounded-lg px-6 py-2.5 font-medium transition-colors"
        >
          Close
        </button>
        <button
          type="submit"
          disabled={!hasChanges}
          className={`rounded-lg px-6 py-2.5 font-medium transition-colors ${
            hasChanges
              ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default PersonalDetails;

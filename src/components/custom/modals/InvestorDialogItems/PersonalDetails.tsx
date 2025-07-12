import { Input } from '@/components/ui/input';
import { PersonalDetails as PDType } from '@/constants/membersConstant';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

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

const PersonalDetails: React.FC<{ details: PDType }> = ({ details }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      first_name: details?.first_name || '',
      last_name: details?.last_name || '',
      email: details?.email || '',
      phone_number: details?.phone_number || '',
      pan_number: details?.pan_number || '',
      aadhaar_number: details?.aadhaar_number || '',
    },
  });

  const onSubmit = (data: FormData) => {
    console.log(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 px-10 py-5 h-full flex flex-col justify-between gap-2"
    >
      <div className="flex flex-col gap-5">
        <div className="flex space-x-4">
          <Controller
            name="first_name"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="First Name"
                className={`${errors.first_name ? 'border-red-500' : null} rounded-none`}
              />
            )}
          />
          <Controller
            name="last_name"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Last Name"
                className={`${errors.last_name ? 'border-red-500' : null} rounded-none`}
              />
            )}
          />
        </div>
        {errors.first_name && (
          <p className="text-red-500 text-sm">{errors.first_name.message}</p>
        )}
        {errors.last_name && (
          <p className="text-red-500 text-sm">{errors.last_name.message}</p>
        )}

        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              placeholder="E-Mail ID"
              className={`${errors.email ? 'border-red-500' : null} rounded-none`}
            />
          )}
        />
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email.message}</p>
        )}

        <Controller
          name="phone_number"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              placeholder="Phone Number"
              className={`${errors.phone_number ? 'border-red-500' : null} rounded-none`}
            />
          )}
        />
        {errors.phone_number && (
          <p className="text-red-500 text-sm">{errors.phone_number.message}</p>
        )}

        <Controller
          name="pan_number"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              disabled //disabled for while
              placeholder="PAN Number"
              className={`${errors.pan_number ? 'border-red-500' : null} rounded-none`}
            />
          )}
        />
        {errors.pan_number && (
          <p className="text-red-500 text-sm">{errors.pan_number.message}</p>
        )}

        <Controller
          name="aadhaar_number"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              disabled //disabled for while
              placeholder="Aadhaar Number"
              className={`${errors.aadhaar_number ? 'border-red-500' : null} rounded-none`}
            />
          )}
        />
        {errors.aadhaar_number && (
          <p className="text-red-500 text-sm">
            {errors.aadhaar_number.message}
          </p>
        )}
      </div>

      <div className="flex gap-3 justify-end">
        <button
          type="submit"
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
  );
};

export default PersonalDetails;

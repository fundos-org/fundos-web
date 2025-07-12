import { Input } from '@/components/ui/input';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dispatch, SetStateAction } from 'react';
import { BankDetails as BDType } from '@/constants/membersConstant';

const schema = z.object({
  bank_account_number: z
    .string()
    .min(9, { message: 'Bank account number must be at least 9 digits' })
    .optional(),
  bank_ifsc: z
    .string()
    .min(11, { message: 'IFSC code must be 11 characters' })
    .optional(),
  account_holder_name: z
    .string()
    .min(1, { message: 'Account holder name is required' })
    .optional(),
});

type FormData = z.infer<typeof schema>;

const BankDetails: React.FC<{
  details: BDType;
  setDialogOpen: Dispatch<SetStateAction<boolean>>;
}> = ({ details, setDialogOpen }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      bank_account_number: details?.bank_account_number || '',
      bank_ifsc: details?.bank_ifsc || '',
      account_holder_name: details?.account_holder_name || '',
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
        <Controller
          name="bank_account_number"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              disabled //disabled for while
              placeholder="Bank Account Number"
              className={`${errors.bank_account_number ? 'border-red-500' : null} rounded-none`}
            />
          )}
        />
        {errors.bank_account_number && (
          <p className="text-red-500 text-sm">
            {errors.bank_account_number.message}
          </p>
        )}

        <Controller
          name="bank_ifsc"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              disabled //disabled for while
              placeholder="Bank IFSC"
              className={`${errors.bank_ifsc ? 'border-red-500' : null} rounded-none`}
            />
          )}
        />
        {errors.bank_ifsc && (
          <p className="text-red-500 text-sm">{errors.bank_ifsc.message}</p>
        )}

        <Controller
          name="account_holder_name"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              placeholder="Account Holder Name"
              className={`${errors.account_holder_name ? 'border-red-500' : null} rounded-none`}
            />
          )}
        />
        {errors.account_holder_name && (
          <p className="text-red-500 text-sm">
            {errors.account_holder_name.message}
          </p>
        )}
      </div>

      <div className="flex gap-3 justify-end">
        <button
          type="button"
          onClick={() => setDialogOpen(false)}
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

export default BankDetails;

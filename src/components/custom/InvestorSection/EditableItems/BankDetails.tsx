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
    formState: { errors, dirtyFields },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      bank_account_number: details?.bank_account_number || '',
      bank_ifsc: details?.bank_ifsc || '',
      account_holder_name: details?.account_holder_name || '',
    },
  });

  // Check if any fields have been modified
  const hasChanges = Object.keys(dirtyFields).length > 0;

  const onSubmit = (data: FormData) => {
    if (!hasChanges) return;
    console.log(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 px-10 py-5 h-full flex flex-col justify-between gap-2"
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
            Bank Account Number
          </label>
          <Controller
            name="bank_account_number"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Enter bank account number"
                className={`bg-gray-50 border border-gray-200 text-gray-900 px-4 py-3 rounded-lg ${errors.bank_account_number ? 'border-red-500' : ''}`}
              />
            )}
          />
          {errors.bank_account_number && (
            <p className="text-red-500 text-sm">
              {errors.bank_account_number.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
            Bank IFSC Code
          </label>
          <Controller
            name="bank_ifsc"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Enter IFSC code"
                className={`bg-gray-50 border border-gray-200 text-gray-900 px-4 py-3 rounded-lg ${errors.bank_ifsc ? 'border-red-500' : ''}`}
              />
            )}
          />
          {errors.bank_ifsc && (
            <p className="text-red-500 text-sm">{errors.bank_ifsc.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
            Account Holder Name
          </label>
          <Controller
            name="account_holder_name"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Enter account holder name"
                className={`bg-gray-50 border border-gray-200 text-gray-900 px-4 py-3 rounded-lg ${errors.account_holder_name ? 'border-red-500' : ''}`}
              />
            )}
          />
          {errors.account_holder_name && (
            <p className="text-red-500 text-sm">
              {errors.account_holder_name.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex gap-3 justify-end mt-8 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={() => setDialogOpen(false)}
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

export default BankDetails;

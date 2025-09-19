import { Input } from '@/components/ui/input';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ProfessionalBackground as PBType,
  UpdateInvestorRequest,
} from '@/constants/membersConstant';
import { Dispatch, SetStateAction } from 'react';

const schema = z.object({
  occupation: z
    .string()
    .min(1, { message: 'Occupation is required' })
    .optional(),
  income_source: z
    .string()
    .min(1, { message: 'Income source is required' })
    .optional(),
  annual_income: z
    .number()
    .min(0, { message: 'Annual income must be non-negative' })
    .optional(),
  capital_commitment: z
    .number()
    .min(0, { message: 'Capital commitment must be non-negative' })
    .optional(),
});

type FormData = z.infer<typeof schema>;

const ProfessionalBackground: React.FC<{
  details: PBType;
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
      occupation: details?.occupation || '',
      income_source: details?.income_source || '',
      annual_income: details?.annual_income || 0,
      capital_commitment: details?.capital_commitment || 0,
    },
  });

  // Check if any fields have been modified
  const hasChanges = Object.keys(dirtyFields).length > 0;

  const onSubmit = ({
    occupation,
    income_source,
    annual_income,
    capital_commitment,
  }: FormData) => {
    if (!hasChanges) return;
    console.log({
      occupation,
      income_source,
      annual_income,
      capital_commitment,
    });
    handleUpdateDetails({
      occupation,
      income_source,
      annual_income,
      capital_commitment,
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 px-10 py-5 h-full flex flex-col justify-between gap-2"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
              Occupation
            </label>
            <Controller
              name="occupation"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Enter occupation"
                  className={`bg-gray-50 border border-gray-200 text-gray-900 px-4 py-3 rounded-lg ${errors.occupation ? 'border-red-500' : ''}`}
                />
              )}
            />
            {errors.occupation && (
              <p className="text-red-500 text-sm">{errors.occupation.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
              Income Source
            </label>
            <Controller
              name="income_source"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Enter income source"
                  className={`bg-gray-50 border border-gray-200 text-gray-900 px-4 py-3 rounded-lg ${errors.income_source ? 'border-red-500' : ''}`}
                />
              )}
            />
            {errors.income_source && (
              <p className="text-red-500 text-sm">
                {errors.income_source.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
              Annual Income (₹)
            </label>
            <Controller
              name="annual_income"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="number"
                  placeholder="Enter annual income"
                  className={`bg-gray-50 border border-gray-200 text-gray-900 px-4 py-3 rounded-lg ${errors.annual_income ? 'border-red-500' : ''}`}
                  onChange={e => field.onChange(Number(e.target.value))}
                />
              )}
            />
            {errors.annual_income && (
              <p className="text-red-500 text-sm">
                {errors.annual_income.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
              Capital Commitment (₹)
            </label>
            <Controller
              name="capital_commitment"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="number"
                  placeholder="Enter capital commitment"
                  className={`bg-gray-50 border border-gray-200 text-gray-900 px-4 py-3 rounded-lg ${errors.capital_commitment ? 'border-red-500' : ''}`}
                  onChange={e => field.onChange(Number(e.target.value))}
                />
              )}
            />
            {errors.capital_commitment && (
              <p className="text-red-500 text-sm">
                {errors.capital_commitment.message}
              </p>
            )}
          </div>
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

export default ProfessionalBackground;

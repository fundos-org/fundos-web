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
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      occupation: details?.occupation || '',
      income_source: details?.income_source || '',
      annual_income: details?.annual_income || 0,
      capital_commitment: details?.capital_commitment || 0,
    },
  });

  const onSubmit = ({
    occupation,
    income_source,
    annual_income,
    capital_commitment,
  }: FormData) => {
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
      <div className="flex flex-col gap-5">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Occupation
          </label>
          <Controller
            name="occupation"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Occupation"
                className={`${errors.occupation ? 'border-red-500' : null} rounded-none`}
              />
            )}
          />
          {errors.occupation && (
            <p className="text-red-500 text-sm">{errors.occupation.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Income Source
          </label>
          <Controller
            name="income_source"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Income Source"
                className={`${errors.income_source ? 'border-red-500' : null} rounded-none`}
              />
            )}
          />
          {errors.income_source && (
            <p className="text-red-500 text-sm">
              {errors.income_source.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Annual Income
          </label>
          <Controller
            name="annual_income"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="number"
                placeholder="Annual Income"
                className={`${errors.annual_income ? 'border-red-500' : null} rounded-none`}
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

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Capital Commitment
          </label>
          <Controller
            name="capital_commitment"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="number"
                placeholder="Capital Commitment"
                className={`${errors.capital_commitment ? 'border-red-500' : null} rounded-none`}
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

export default ProfessionalBackground;

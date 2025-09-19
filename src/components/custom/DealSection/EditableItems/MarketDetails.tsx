import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dispatch, SetStateAction } from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  industryType,
  businessModels,
  stages,
  DealDetails,
} from '@/constants/dealsConstant';
import CustomToggleGroup from '../../CustomToggleGroup';

interface MarketDetailsType {
  industry: string;
  business_model: string;
  company_stage: string;
}

const schema = z.object({
  industry: z.string().min(1, { message: 'Industry is required' }).optional(),
  business_model: z
    .string()
    .min(1, { message: 'Business model is required' })
    .optional(),
  company_stage: z
    .string()
    .min(1, { message: 'Company stage is required' })
    .optional(),
});

type FormData = z.infer<typeof schema>;

const MarketDetails: React.FC<{
  details: MarketDetailsType;
  setDealId: Dispatch<SetStateAction<string | null>>;
  handleUpdateDetails: (value: Partial<DealDetails>) => void;
}> = ({ details, setDealId, handleUpdateDetails }) => {
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, dirtyFields },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      industry: details?.industry || '',
      business_model: details?.business_model || '',
      company_stage: details?.company_stage || '',
    },
  });

  // Check if any fields have been modified
  const hasChanges = Object.keys(dirtyFields).length > 0;

  const onSubmit = ({ industry, business_model, company_stage }: FormData) => {
    if (!hasChanges) return;
    handleUpdateDetails({
      industry,
      business_model,
      company_stage,
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 w-full"
    >
      <div className="space-y-6">
        <div className="space-y-3">
          <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
            Industry
          </label>
          <Controller
            name="industry"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger className="w-full bg-gray-50 border border-gray-200 text-gray-900 px-4 py-3 rounded-lg">
                  <SelectValue placeholder="Select Industry" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 rounded-lg">
                  <SelectGroup>
                    {industryType.map(({ name, value }) => (
                      <SelectItem
                        key={name}
                        value={value}
                      >
                        {name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
          {errors.industry && (
            <p className="text-red-600 text-sm">{errors.industry.message}</p>
          )}
        </div>

        <div className="space-y-3">
          <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
            Business Model
          </label>
          <CustomToggleGroup
            array={businessModels}
            value={watch('business_model') ?? ''}
            setValue={(value: string) =>
              setValue('business_model', value, { shouldValidate: true })
            }
          />
          {errors.business_model && (
            <p className="text-red-600 text-sm">
              {errors.business_model.message}
            </p>
          )}
        </div>

        <div className="space-y-3">
          <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
            Company Stage
          </label>
          <Controller
            name="company_stage"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger className="w-full bg-gray-50 border border-gray-200 text-gray-900 px-4 py-3 rounded-lg">
                  <SelectValue placeholder="Select Company Stage" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 rounded-lg">
                  <SelectGroup>
                    {stages.map(({ value, title }) => (
                      <SelectItem key={value} value={value}>
                        {title}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
          {errors.company_stage && (
            <p className="text-red-600 text-sm">
              {errors.company_stage.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={() => setDealId(null)}
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

export default MarketDetails;

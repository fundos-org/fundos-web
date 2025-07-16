import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dispatch, SetStateAction } from 'react';
import { Label } from '@/components/ui/label';
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
import NewCustomRadioGroup from '../../NewCustomRadioGroup';

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
  setDialogOpen: Dispatch<SetStateAction<boolean>>;
  handleUpdateDetails: (value: Partial<DealDetails>) => void;
}> = ({ details, setDialogOpen, handleUpdateDetails }) => {
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      industry: details?.industry || '',
      business_model: details?.business_model || '',
      company_stage: details?.company_stage || '',
    },
  });

  const onSubmit = ({ industry, business_model, company_stage }: FormData) => {
    handleUpdateDetails({
      industry,
      business_model,
      company_stage,
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 px-10 py-5 h-full flex flex-col justify-between gap-2"
    >
      <div className="flex flex-col gap-5">
        <div>
          <Label
            htmlFor="industry"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            Industry
          </Label>
          <Controller
            name="industry"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger className="w-full rounded-none text-white">
                  <SelectValue placeholder="Select Industry" />
                </SelectTrigger>
                <SelectContent className="rounded-none text-white bg-[#1a1a1a]">
                  <SelectGroup>
                    {industryType.map(({ name, value }) => (
                      <SelectItem
                        key={name}
                        value={value}
                        className="rounded-none"
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
            <p className="text-red-500 text-sm">{errors.industry.message}</p>
          )}
        </div>

        <div>
          <Label
            htmlFor="business_model"
            className="text-right text-white mb-2"
          >
            Business Model
          </Label>
          <CustomToggleGroup
            array={businessModels}
            value={watch('business_model') ?? ''}
            setValue={(value: string) =>
              setValue('business_model', value, { shouldValidate: true })
            }
          />
          {errors.business_model && (
            <p className="text-red-500 text-sm">
              {errors.business_model.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="company_stage" className="text-right text-white mb-2">
            Company Stage
          </Label>
          <NewCustomRadioGroup
            value={watch('company_stage') ?? ''}
            setValue={(value: string) =>
              setValue('company_stage', value, { shouldValidate: true })
            }
            stages={stages}
          />
          {errors.company_stage && (
            <p className="text-red-500 text-sm">
              {errors.company_stage.message}
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

export default MarketDetails;

import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import CustomToggleGroup from '../CustomToggleGroup';
import { businessModels, industryType } from '@/constants/dealsConstant';

const Step2: React.FC = () => {
  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = useFormContext();
  const industry = watch('industry');

  return (
    <div className="space-y-6 w-full">
      <div className="space-y-3">
        <label htmlFor="industry" className="text-xs font-medium text-gray-600 uppercase tracking-wide">
          Industry
        </label>
        <Select
          onValueChange={value =>
            setValue('industry', value, { shouldValidate: true })
          }
          defaultValue={industry}
        >
          <SelectTrigger className="w-full bg-gray-50 border border-gray-200 text-gray-900 px-4 py-3 rounded-lg">
            <SelectValue placeholder="Select Industry" />
          </SelectTrigger>
          <SelectContent className="bg-white border border-gray-200 rounded-lg">
            <SelectGroup>
              {industryType.map(({ name, value }) => (
                <SelectItem key={name} value={value} className="rounded-none">
                  {name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        {errors.industry && (
          <p className="text-red-600 text-sm">
            {String(errors.industry.message)}
          </p>
        )}
      </div>
      <div className="space-y-3">
        <label htmlFor="problemStatement" className="text-xs font-medium text-gray-600 uppercase tracking-wide">
          Problem Statement
        </label>
        <Textarea
          id="problemStatement"
          {...register('problemStatement', {
            required: 'Problem statement is required',
          })}
          placeholder="Describe problem statement"
          className="bg-gray-50 border border-gray-200 text-gray-900 px-4 py-3 rounded-lg min-h-[80px]"
        />
        {errors.problemStatement && (
          <p className="text-red-600 text-sm">
            {String(errors.problemStatement.message)}
          </p>
        )}
      </div>
      <div className="space-y-3">
        <label htmlFor="businessModel" className="text-xs font-medium text-gray-600 uppercase tracking-wide">
          Business Model
        </label>
        <CustomToggleGroup
          array={businessModels}
          value={watch('businessModel')}
          setValue={value =>
            setValue('businessModel', value, { shouldValidate: true })
          }
        />
        {errors.businessModel && (
          <p className="text-red-600 text-sm">
            {String(errors.businessModel.message)}
          </p>
        )}
      </div>
    </div>
  );
};

export default Step2;

import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Label } from '@/components/ui/label';
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
    <div className="h-[50vh] overflow-auto grid gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="industry" className="text-right text-white">
          Industry
        </Label>
        <Select
          onValueChange={value =>
            setValue('industry', value, { shouldValidate: true })
          }
          defaultValue={industry}
        >
          <SelectTrigger className="w-full rounded-none text-white">
            <SelectValue placeholder="Select Industry" />
          </SelectTrigger>
          <SelectContent className="rounded-none text-white bg-[#1a1a1a]">
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
          <p className="text-red-500 text-sm">
            {String(errors.industry.message)}
          </p>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="problemStatement" className="text-right text-white">
          Problem Statement
        </Label>
        <Textarea
          id="problemStatement"
          {...register('problemStatement', {
            required: 'Problem statement is required',
          })}
          placeholder="Describe problem statement"
          className="rounded-none text-white"
        />
        {errors.problemStatement && (
          <p className="text-red-500 text-sm">
            {String(errors.problemStatement.message)}
          </p>
        )}
      </div>
      <div className="flex flex-col gap-2 mb-10">
        <Label htmlFor="businessModel" className="text-right text-white">
          Business Model
        </Label>
        <CustomToggleGroup
          array={businessModels}
          value={watch('businessModel')}
          setValue={value =>
            setValue('businessModel', value, { shouldValidate: true })
          }
        />
        {errors.businessModel && (
          <p className="text-red-500 text-sm">
            {String(errors.businessModel.message)}
          </p>
        )}
      </div>
    </div>
  );
};

export default Step2;

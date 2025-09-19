import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { securities } from '@/constants/dealsConstant';
import { Input } from '@/components/ui/input';

const Step5: React.FC = () => {
  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = useFormContext();

  return (
    <div className="space-y-6 w-full">
      <div className="space-y-3">
        <label htmlFor="instrumentType" className="text-xs font-medium text-gray-600 uppercase tracking-wide">
          Instrument (Types of Securities)
        </label>
        <Select
          onValueChange={value =>
            setValue('instrumentType', value, { shouldValidate: true })
          }
          defaultValue={watch('instrumentType')}
        >
          <SelectTrigger className="w-full bg-gray-50 border border-gray-200 text-gray-900 px-4 py-3 rounded-lg">
            <SelectValue placeholder="Select Instrument Type" />
          </SelectTrigger>
          <SelectContent className="bg-white border border-gray-200 rounded-lg">
            <SelectGroup>
              {securities.map(({ name, value }) => (
                <SelectItem key={name} value={value}>
                  {name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        {errors.instrumentType && (
          <p className="text-red-600 text-sm">
            {String(errors.instrumentType.message)}
          </p>
        )}
      </div>

      <div className="space-y-3">
        <label htmlFor="conversionTerms" className="text-xs font-medium text-gray-600 uppercase tracking-wide">
          Conversion Terms
        </label>
        <Textarea
          id="conversionTerms"
          {...register('conversionTerms', {
            required: 'Conversion terms are required',
          })}
          placeholder="Enter conversion terms"
          className="bg-gray-50 border border-gray-200 text-gray-900 px-4 py-3 rounded-lg min-h-[80px]"
        />
        {errors.conversionTerms && (
          <p className="text-red-600 text-sm">
            {String(errors.conversionTerms.message)}
          </p>
        )}
      </div>

      <div className="space-y-3">
        <label htmlFor="managementFee" className="text-xs font-medium text-gray-600 uppercase tracking-wide">
          Management Fee (%)
        </label>
        <Input
          type="number"
          id="managementFee"
          {...register('managementFee', {
            required: 'Management fee is required',
            pattern: {
              value: /^\d+(\.\d{1,2})?$/,
              message: 'Enter a valid percentage',
            },
          })}
          placeholder="Enter management fee percentage"
          className="bg-gray-50 border border-gray-200 text-gray-900 px-4 py-3 rounded-lg"
        />
        {errors.managementFee && (
          <p className="text-red-600 text-sm">
            {String(errors.managementFee.message)}
          </p>
        )}
      </div>

      <div className="space-y-3">
        <label htmlFor="carryPercentage" className="text-xs font-medium text-gray-600 uppercase tracking-wide">
          Carry Percentage (%)
        </label>
        <Input
          type="number"
          id="carryPercentage"
          {...register('carryPercentage', {
            required: 'Carry percentage is required',
            pattern: {
              value: /^\d+(\.\d{1,2})?$/,
              message: 'Enter a valid percentage',
            },
          })}
          placeholder="Enter carry percentage"
          className="bg-gray-50 border border-gray-200 text-gray-900 px-4 py-3 rounded-lg"
        />
        {errors.carryPercentage && (
          <p className="text-red-600 text-sm">
            {String(errors.carryPercentage.message)}
          </p>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex items-center space-x-3">
          <Checkbox
            id="isStartup"
            checked={watch('isStartup')}
            onCheckedChange={checked =>
              setValue('isStartup', checked, { shouldValidate: true })
            }
            className="border-gray-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
          />
          <label
            htmlFor="isStartup"
            className="text-sm font-medium text-gray-700 cursor-pointer"
          >
            Is this a startup?
          </label>
        </div>
        {errors.isStartup && (
          <p className="text-red-600 text-sm">
            {String(errors.isStartup.message)}
          </p>
        )}
      </div>
    </div>
  );
};

export default Step5;
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import CustomToggleGroup from '../CustomToggleGroup';
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
    <div className="h-[50vh] overflow-auto grid gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="instrumentType" className="text-right text-white">
          Instrument (Types of Securities)
        </Label>
        <CustomToggleGroup
          value={watch('instrumentType')}
          array={securities}
          setValue={value =>
            setValue('instrumentType', value, { shouldValidate: true })
          }
        />
        {errors.instrumentType && (
          <p className="text-red-400 text-sm">
            {String(errors.instrumentType.message)}
          </p>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="conversionTerms" className="text-right text-white">
          Conversion Terms
        </Label>
        <Textarea
          id="conversionTerms"
          {...register('conversionTerms', {
            required: 'Conversion terms are required',
          })}
          placeholder="Describe conversion terms"
          className="rounded-none text-white"
        />
        {errors.conversionTerms && (
          <p className="text-red-400 text-sm">
            {String(errors.conversionTerms.message)}
          </p>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="managementFee" className="text-right text-white">
          Management Fee (%)
        </Label>
        <Input
          type="number"
          id="managementFee"
          {...register('managementFee', {
            required: 'Management fee is required',
            pattern: {
              value: /^\d+(\.\d{1,2})?$/,
              message: 'Enter a valid number',
            },
            max: {
              value: 5,
              message: 'Management fee cannot exceed 5%',
            },
          })}
          max={5}
          step="0.01"
          placeholder="Enter management fee"
          className="rounded-none text-white"
        />
        {errors.managementFee && (
          <p className="text-red-400 text-sm">
            {String(errors.managementFee.message)}
          </p>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="carryPercentage" className="text-right text-white">
          Carry Percentage (%)
        </Label>
        <Input
          type="number"
          id="carryPercentage"
          {...register('carryPercentage', {
            required: 'Carry percentage is required',
            pattern: {
              value: /^\d+(\.\d{1,2})?$/,
              message: 'Enter a valid number',
            },
            max: {
              value: 20,
              message: 'Carry percentage cannot exceed 20%',
            },
          })}
          max={20}
          step="0.01"
          placeholder="Enter carry percentage"
          className="rounded-none text-white"
        />
        {errors.carryPercentage && (
          <p className="text-red-400 text-sm">
            {String(errors.carryPercentage.message)}
          </p>
        )}
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="isStartup"
          checked={watch('isStartup')}
          onCheckedChange={checked =>
            setValue('isStartup', checked === true, { shouldValidate: true })
          }
        />
        <label
          htmlFor="isStartup"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          I agree that the Company is a Startup as per applicable provisions of
          the SEBI (Alternative Investment Funds) Regulations, 2012
        </label>
        {errors.isStartup?.message && (
          <p className="text-red-400 text-sm">
            {String(errors.isStartup.message)}
          </p>
        )}
      </div>
    </div>
  );
};

export default Step5;

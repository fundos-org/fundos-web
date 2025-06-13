import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import CustomRadioButtonGroup from '../CustomRadioButtonGroup';
import CustomToggleGroup from '../CustomToggleGroup';
import { stages, targetCustomers } from '@/constants/dealsConstant';

const Step3: React.FC = () => {
  const {
    formState: { errors },
    setValue,
    watch,
  } = useFormContext();

  return (
    <div className="grid gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="companyStage" className="text-right text-white">
          Company Stage
        </Label>
        <CustomRadioButtonGroup
          value={watch('companyStage')}
          setValue={value =>
            setValue('companyStage', value, { shouldValidate: true })
          }
          stages={stages}
        />
        {errors.companyStage?.message && (
          <p className="text-red-400 text-sm">
            {String(errors.companyStage.message)}
          </p>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <Label
          htmlFor="targetCustomerSegment"
          className="text-right text-white"
        >
          Target Customer Segment
        </Label>
        <CustomToggleGroup
          value={watch('targetCustomerSegment')}
          array={targetCustomers}
          setValue={value =>
            setValue('targetCustomerSegment', value, { shouldValidate: true })
          }
        />
        {errors.targetCustomerSegment && (
          <p className="text-red-400 text-sm">
            {String(errors.targetCustomerSegment.message)}
          </p>
        )}
      </div>
    </div>
  );
};

export default Step3;

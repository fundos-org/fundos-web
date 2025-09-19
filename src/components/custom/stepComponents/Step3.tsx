import React from 'react';
import { useFormContext } from 'react-hook-form';
import CustomToggleGroup from '../CustomToggleGroup';
import { stages, targetCustomers } from '@/constants/dealsConstant';
import NewCustomRadioGroup from '../NewCustomRadioGroup';

const Step3: React.FC = () => {
  const {
    formState: { errors },
    setValue,
    watch,
  } = useFormContext();

  return (
    <div className="space-y-6 w-full">
      <div className="space-y-3">
        <label htmlFor="companyStage" className="text-xs font-medium text-gray-600 uppercase tracking-wide">
          Company Stage
        </label>
        <NewCustomRadioGroup
          value={watch('companyStage')}
          setValue={(value: string) =>
            setValue('companyStage', value, { shouldValidate: true })
          }
          stages={stages}
        />
        {errors.companyStage?.message && (
          <p className="text-red-600 text-sm">
            {String(errors.companyStage.message)}
          </p>
        )}
      </div>
      <div className="space-y-3">
        <label
          htmlFor="targetCustomerSegment"
          className="text-xs font-medium text-gray-600 uppercase tracking-wide"
        >
          Target Customer Segment
        </label>
        <CustomToggleGroup
          value={watch('targetCustomerSegment')}
          array={targetCustomers}
          setValue={value =>
            setValue('targetCustomerSegment', value, { shouldValidate: true })
          }
        />
        {errors.targetCustomerSegment && (
          <p className="text-red-600 text-sm">
            {String(errors.targetCustomerSegment.message)}
          </p>
        )}
      </div>
    </div>
  );
};

export default Step3;

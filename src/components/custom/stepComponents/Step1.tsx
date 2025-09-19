import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import FileInput from '../FileInput';

const Step1: React.FC = () => {
  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = useFormContext();
  const logo = watch('logo');

  return (
    <div className="space-y-6 w-full">
      <div className="space-y-3">
        <label htmlFor="companyName" className="text-xs font-medium text-gray-600 uppercase tracking-wide">
          Company Name
        </label>
        <Input
          id="companyName"
          {...register('companyName', { required: 'Company name is required' })}
          placeholder="Enter company name"
          className="bg-gray-50 border border-gray-200 text-gray-900 px-4 py-3 rounded-lg"
        />
        {errors.companyName && (
          <p className="text-red-600 text-sm">
            {String(errors.companyName.message)}
          </p>
        )}
      </div>
      <div className="space-y-3">
        <label htmlFor="aboutCompany" className="text-xs font-medium text-gray-600 uppercase tracking-wide">
          About Company
        </label>
        <Textarea
          id="aboutCompany"
          {...register('aboutCompany', {
            required: 'About company is required',
          })}
          placeholder="Enter about company"
          className="bg-gray-50 border border-gray-200 text-gray-900 px-4 py-3 rounded-lg min-h-[80px]"
        />
        {errors.aboutCompany && (
          <p className="text-red-600 text-sm">
            {String(errors.aboutCompany.message)}
          </p>
        )}
      </div>
      <div className="space-y-3">
        <label
          htmlFor="investmentSchemeAppendix"
          className="text-xs font-medium text-gray-600 uppercase tracking-wide"
        >
          Investment Scheme Appendix
        </label>
        <Input
          id="investmentSchemeAppendix"
          {...register('investmentSchemeAppendix', {
            required: 'Investment Scheme Appendix is required',
          })}
          placeholder="Enter Investment Scheme Appendix"
          className="bg-gray-50 border border-gray-200 text-gray-900 px-4 py-3 rounded-lg"
        />
        {errors.investmentSchemeAppendix && (
          <p className="text-red-600 text-sm">
            {String(errors.investmentSchemeAppendix.message)}
          </p>
        )}
      </div>
      <div className="space-y-3">
        <label htmlFor="logo" className="text-xs font-medium text-gray-600 uppercase tracking-wide">
          Logo Image
        </label>
        <FileInput
          file={logo}
          id="logo"
          setFile={file => setValue('logo', file, { shouldValidate: true })}
          accept="image/*"
          maxSize={50 * 1024 * 1024} // 50MB
        />
        {errors.logo && (
          <p className="text-red-600 text-sm">{String(errors.logo.message)}</p>
        )}
      </div>
    </div>
  );
};

export default Step1;

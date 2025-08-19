import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Label } from '@/components/ui/label';
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
    <div className="h-[50vh] overflow-auto grid gap-4 w-full">
      <div className="flex flex-col gap-2">
        <Label htmlFor="companyName" className="text-right text-white">
          Company Name
        </Label>
        <Input
          id="companyName"
          {...register('companyName', { required: 'Company name is required' })}
          placeholder="Enter company name"
          className="rounded-none text-white"
        />
        {errors.companyName && (
          <p className="text-red-400 text-sm">
            {String(errors.companyName.message)}
          </p>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="aboutCompany" className="text-right text-white">
          About Company
        </Label>
        <Textarea
          id="aboutCompany"
          {...register('aboutCompany', {
            required: 'About company is required',
          })}
          placeholder="Enter about company"
          className="rounded-none text-white"
        />
        {errors.aboutCompany && (
          <p className="text-red-400 text-sm">
            {String(errors.aboutCompany.message)}
          </p>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <Label
          htmlFor="investmentSchemeAppendix"
          className="text-right text-white"
        >
          Investment Scheme Appendix
        </Label>
        <Input
          id="investmentSchemeAppendix"
          {...register('investmentSchemeAppendix', {
            required: 'Investment Scheme Appendix is required',
          })}
          placeholder="Enter Investment Scheme Appendix"
          className="rounded-none text-white"
        />
        {errors.investmentSchemeAppendix && (
          <p className="text-red-400 text-sm">
            {String(errors.investmentSchemeAppendix.message)}
          </p>
        )}
      </div>
      <div>
        <Label htmlFor="logo" className="text-right text-white">
          Logo Image
        </Label>
        <FileInput
          file={logo}
          id="logo"
          setFile={file => setValue('logo', file, { shouldValidate: true })}
          accept="image/*"
          maxSize={50 * 1024 * 1024} // 50MB
        />
        {errors.logo && (
          <p className="text-red-400 text-sm">{String(errors.logo.message)}</p>
        )}
      </div>
    </div>
  );
};

export default Step1;

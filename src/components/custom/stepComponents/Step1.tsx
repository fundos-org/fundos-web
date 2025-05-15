import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import ImageInput from '../ImageUpload';

const Step1: React.FC = () => {
  const { register, formState: { errors }, setValue, watch } = useFormContext();
  const logo = watch('logo');

  return (
    <div className="grid gap-4">
      <div>
        <Label htmlFor="logo" className="text-right text-white">Upload Logo</Label>
        <ImageInput
          image={logo}
          id="logo"
          setImage={(file) => setValue('logo', file, { shouldValidate: true })}
        />
        {errors.logo && <p className="text-red-500 text-sm">{String(errors.logo.message)}</p>}
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="companyName" className="text-right text-white">Company Name</Label>
        <Input
          id="companyName"
          {...register('companyName', { required: 'Company name is required' })}
          placeholder="Enter company name"
          className="rounded-none text-white"
        />
        {errors.companyName && <p className="text-red-500 text-sm">{String(errors.companyName.message)}</p>}
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="aboutCompany" className="text-right text-white">About Company</Label>
        <Textarea
          id="aboutCompany"
          {...register('aboutCompany', { required: 'About company is required' })}
          placeholder="Enter about company"
          className="rounded-none text-white"
        />
        {errors.aboutCompany && <p className="text-red-500 text-sm">{String(errors.aboutCompany.message)}</p>}
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="companyWebsite" className="text-right text-white">Company Website</Label>
        <Input
          id="companyWebsite"
          {...register('companyWebsite', { 
            required: 'Website is required',
            pattern: {
              value: /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/i,
              message: 'Invalid website URL'
            }
          })}
          placeholder="Enter company website"
          className="rounded-none text-white"
        />
        {errors.companyWebsite && <p className="text-red-500 text-sm">{String(errors.companyWebsite.message)}</p>}
      </div>
    </div>
  );
};

export default Step1;
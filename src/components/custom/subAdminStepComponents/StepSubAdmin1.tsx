import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import ImageInput from '../ImageUpload';

const StepSubAdmin1: React.FC = () => {
  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = useFormContext();
  const logo = watch('logo');

  return (
    <div className="grid gap-4">
      <div className="flex gap-6">
        <div>
          <Label htmlFor="logo" className="text-right text-white">
            Upload Logo<span className="text-red-400">*</span>
          </Label>
          <ImageInput
            image={logo}
            id="logo"
            setImage={file => setValue('logo', file, { shouldValidate: true })}
          />
          {errors.logo && (
            <p className="text-red-400 text-sm">
              {String(errors.logo.message)}
            </p>
          )}
        </div>

        <div className="w-full flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <Label htmlFor="subadminname" className="text-right text-white">
              Sub Admin Name<span className="text-red-400">*</span>
            </Label>
            <Input
              id="subadminname"
              {...register('subadminname', {
                required: 'Subadmin name is required',
              })}
              placeholder="Enter subadmin name"
              className="rounded-none text-white"
            />
            {errors.subadminname && (
              <p className="text-red-400 text-sm">
                {String(errors.subadminname.message)}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="subadminmail" className="text-right text-white">
              Sub Admin Email<span className="text-red-400">*</span>
            </Label>
            <Input
              id="subadminmail"
              type="email"
              {...register('subadminmail', {
                required: 'Email is required',
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: 'Invalid email address',
                },
              })}
              placeholder="Enter subadmin email"
              className="rounded-none text-white"
            />
            {errors.subadminmail && (
              <p className="text-red-400 text-sm">
                {String(errors.subadminmail.message)}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="subadmincontact" className="text-right text-white">
          Sub Admin Contact<span className="text-red-400">*</span>
        </Label>
        <Input
          id="subadmincontact"
          {...register('subadmincontact', {
            required: 'Contact is required',
            pattern: {
              value: /^\+?[\d\s-]{10,}$/,
              message: 'Invalid contact number',
            },
          })}
          placeholder="Enter contact number"
          className="rounded-none text-white"
        />
        {errors.subadmincontact && (
          <p className="text-red-400 text-sm">
            {String(errors.subadmincontact.message)}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="about" className="text-right text-white">
          About<span className="text-red-400">*</span>
        </Label>
        <Textarea
          id="about"
          {...register('about', { required: 'About is required' })}
          placeholder="Enter about subadmin"
          className="rounded-none text-white"
        />
        {errors.about && (
          <p className="text-red-400 text-sm">{String(errors.about.message)}</p>
        )}
      </div>
    </div>
  );
};

export default StepSubAdmin1;

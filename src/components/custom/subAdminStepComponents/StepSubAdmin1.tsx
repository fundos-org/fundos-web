import React, { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import ImageInput from '../ImageUpload';
import { validateFields } from '@/axioscalls/apiServices';

const StepSubAdmin1: React.FC = () => {
  const {
    register,
    formState: { errors },
    setValue,
    watch,
    setError,
    clearErrors,
  } = useFormContext();
  const logo = watch('logo');
  const email = watch('subadminmail');
  const contact = watch('subadmincontact');

  // Re-validate on mount to restore server errors after rerenders/unmounts
  useEffect(() => {
    const restore = async () => {
      // Email
      if (
        email &&
        !(errors.subadminmail && errors.subadminmail.type === 'pattern')
      ) {
        try {
          const available = await validateFields('email', String(email));
          if (available === false) {
            setError('subadminmail', {
              type: 'server',
              message: 'Email already in use',
            });
          }
        } catch {
          // ignore restore validation failure
        }
      }
      // Contact
      if (contact) {
        try {
          const numericContact = String(contact).replace(/\D/g, '');
          if (numericContact.length >= 10) {
            const available = await validateFields('contact', numericContact);
            if (available === false) {
              setError('subadmincontact', {
                type: 'server',
                message: 'Contact number already in use',
              });
            }
          }
        } catch {
          // ignore restore validation failure
        }
      }
    };
    restore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debounced email uniqueness validation
  useEffect(() => {
    if (!email) return;
    // Skip server check if client-side pattern error exists
    if (errors.subadminmail && errors.subadminmail.type === 'pattern') return;
    const currentEmail = email as string;
    const handle = setTimeout(async () => {
      try {
        const available = await validateFields('email', currentEmail);
        if (available === false) {
          setError('subadminmail', {
            type: 'server',
            message: 'Email already in use',
          });
        } else if (
          errors.subadminmail &&
          errors.subadminmail.type === 'server'
        ) {
          clearErrors('subadminmail');
        }
      } catch {
        // Silently ignore server errors for debounce validation
      }
    }, 300);
    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email]);

  // Debounced contact uniqueness validation
  useEffect(() => {
    if (!contact) return;
    // Strip non-digits for validation request
    const numericContact = String(contact).replace(/\D/g, '');
    if (numericContact.length < 10) return;
    const handle = setTimeout(async () => {
      try {
        const available = await validateFields('contact', numericContact);
        if (available === false) {
          setError('subadmincontact', {
            type: 'server',
            message: 'Contact number already in use',
          });
        } else if (
          errors.subadmincontact &&
          errors.subadmincontact.type === 'server'
        ) {
          clearErrors('subadmincontact');
        }
      } catch {
        // Silently ignore server errors for debounce validation
      }
    }, 300);
    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contact]);

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
          minLength={10}
          maxLength={10}
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

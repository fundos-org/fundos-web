import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import ImageInput from '../ImageUpload';
import { validateFields } from '@/axioscalls/apiServices';
import { CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';

const StepSubAdmin1: React.FC = () => {
  const {
    register,
    formState: { errors },
    setValue,
    watch,
    setError,
    clearErrors,
    getValues,
  } = useFormContext();
  const logo = watch('logo');
  const email = watch('subadminmail');
  const contact = watch('subadmincontact');
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [emailAvailable, setEmailAvailable] = useState<null | boolean>(null);
  const [isCheckingContact, setIsCheckingContact] = useState(false);
  const [contactAvailable, setContactAvailable] = useState<null | boolean>(
    null
  );

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
            setEmailAvailable(false);
          } else {
            setEmailAvailable(true);
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
              setContactAvailable(false);
            } else {
              setContactAvailable(true);
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
    setIsCheckingEmail(true);
    setEmailAvailable(null);
    const currentEmail = email as string;
    const handle = setTimeout(async () => {
      try {
        const available = await validateFields('email', currentEmail);
        if (available === false) {
          setError('subadminmail', {
            type: 'server',
            message: 'Email already in use',
          });
          setEmailAvailable(false);
        } else if (
          errors.subadminmail &&
          errors.subadminmail.type === 'server'
        ) {
          clearErrors('subadminmail');
          setEmailAvailable(true);
        } else {
          setEmailAvailable(true);
        }
      } catch {
        // Silently ignore server errors for debounce validation
      } finally {
        if (currentEmail === getValues('subadminmail')) {
          setIsCheckingEmail(false);
        }
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
    setIsCheckingContact(true);
    setContactAvailable(null);
    const handle = setTimeout(async () => {
      try {
        const available = await validateFields('contact', numericContact);
        if (available === false) {
          setError('subadmincontact', {
            type: 'server',
            message: 'Contact number already in use',
          });
          setContactAvailable(false);
        } else if (
          errors.subadmincontact &&
          errors.subadmincontact.type === 'server'
        ) {
          clearErrors('subadmincontact');
          setContactAvailable(true);
        } else {
          setContactAvailable(true);
        }
      } catch {
        // Silently ignore server errors for debounce validation
      } finally {
        if (
          numericContact ===
          String(getValues('subadmincontact')).replace(/\D/g, '')
        ) {
          setIsCheckingContact(false);
        }
      }
    }, 300);
    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contact]);

  return (
    <div className="space-y-6">
      <div className="flex gap-6">
        <div>
          <Label htmlFor="logo" className="text-sm font-medium text-gray-700">
            Upload Logo<span className="text-red-500">*</span>
          </Label>
          <ImageInput
            image={logo}
            id="logo"
            setImage={file => setValue('logo', file, { shouldValidate: true })}
          />
          {errors.logo && (
            <p className="text-red-500 text-sm flex items-center mt-1">
              <span className="mr-1">⚠️</span>
              {String(errors.logo.message)}
            </p>
          )}
        </div>

        <div className="w-full space-y-6">
          <div className="space-y-2">
            <Label htmlFor="subadminname" className="text-sm font-medium text-gray-700">
              Sub Admin Name<span className="text-red-500">*</span>
            </Label>
            <Input
              id="subadminname"
              {...register('subadminname', {
                required: 'Subadmin name is required',
              })}
              placeholder="Enter sub admin name"
              className="rounded-lg bg-white text-gray-900 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-colors"
            />
            {errors.subadminname && (
              <p className="text-red-500 text-sm flex items-center mt-1">
                <span className="mr-1">⚠️</span>
                {String(errors.subadminname.message)}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="subadminmail" className="text-sm font-medium text-gray-700">
                Sub Admin Email<span className="text-red-500">*</span>
              </Label>
              <div className="flex items-center gap-2 text-sm">
                {isCheckingEmail && (
                  <span className="flex items-center gap-1 text-gray-500">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Checking...
                  </span>
                )}
                {!isCheckingEmail && email && emailAvailable === true && (
                  <span className="flex items-center gap-1 text-green-600">
                    <CheckCircle2 className="h-4 w-4" />
                    Available
                  </span>
                )}
                {!isCheckingEmail && email && emailAvailable === false && (
                  <span className="flex items-center gap-1 text-red-500">
                    <AlertTriangle className="h-4 w-4" />
                    Already exists
                  </span>
                )}
              </div>
            </div>
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
              placeholder="Enter sub admin email"
              className="rounded-lg bg-white text-gray-900 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-colors"
            />
            {errors.subadminmail && (
              <p className="text-red-500 text-sm flex items-center mt-1">
                <span className="mr-1">⚠️</span>
                {String(errors.subadminmail.message)}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="subadmincontact" className="text-sm font-medium text-gray-700">
            Contact Number<span className="text-red-500">*</span>
          </Label>
          <div className="flex items-center gap-2 text-sm">
            {isCheckingContact && (
              <span className="flex items-center gap-1 text-gray-500">
                <Loader2 className="h-4 w-4 animate-spin" />
                Checking...
              </span>
            )}
            {!isCheckingContact && contact && contactAvailable === true && (
              <span className="flex items-center gap-1 text-green-600">
                <CheckCircle2 className="h-4 w-4" />
                Available
              </span>
            )}
            {!isCheckingContact && contact && contactAvailable === false && (
              <span className="flex items-center gap-1 text-red-500">
                <AlertTriangle className="h-4 w-4" />
                Already exists
              </span>
            )}
          </div>
        </div>
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
          className="rounded-lg bg-white text-gray-900 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-colors"
        />
        {errors.subadmincontact && (
          <p className="text-red-500 text-sm flex items-center mt-1">
            <span className="mr-1">⚠️</span>
            {String(errors.subadmincontact.message)}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="about" className="text-sm font-medium text-gray-700">
          About<span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="about"
          {...register('about', { required: 'About is required' })}
          placeholder="Enter description about the sub admin"
          rows={4}
          className="rounded-lg bg-white text-gray-900 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-colors resize-none"
        />
        {errors.about && (
          <p className="text-red-500 text-sm flex items-center mt-1">
            <span className="mr-1">⚠️</span>
            {String(errors.about.message)}
          </p>
        )}
      </div>
    </div>
  );
};

export default StepSubAdmin1;

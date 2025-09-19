import { X } from 'lucide-react';
import {
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FormProvider, useForm } from 'react-hook-form';
import OverviewStep from '../subAdminStepComponents/OverviewStep';
import StepSubAdmin1 from '../subAdminStepComponents/StepSubAdmin1';
import StepSubAdmin2 from '../subAdminStepComponents/StepSubAdmin2';
import {
  createCredentials,
  createProfile,
  shareDetails,
} from '@/axioscalls/apiServices';
import { useNotification } from '@/components/custom/NotificationProvider';
import { useQueryClient } from 'react-query';
import { QueryEnums } from '@/queryEnums';

export interface FormData {
  logo: File | null;
  subadminname: string;
  subadminmail: string;
  subadmincontact: string;
  about: string;
  username: string;
  password: string;
  reenterpassword: string;
  appname: string;
  invitecode: string;
}

function CreateSubAdminDialog() {
  const [activeStep, setActiveStep] = useState(0);
  const [subAdminId, setSubAdminId] = useState('');
  const [submittedData, setSubmittedData] = useState<
    Partial<Record<number, Partial<FormData>>>
  >({});
  const queryClient = useQueryClient();
  const notification = useNotification();
  const methods = useForm<FormData>({
    defaultValues: {
      logo: null,
      subadminname: '',
      subadminmail: '',
      subadmincontact: '',
      about: '',
      username: '',
      password: '',
      reenterpassword: '',
      appname: '',
      invitecode: '',
    },
    mode: 'onChange',
  });

  // Watch form values to enable/disable Next button
  const watchedValues = methods.watch();

  // Define required fields for each step
  const stepRequiredFields: Record<number, (keyof FormData)[]> = {
    0: ['logo', 'subadminname', 'subadminmail', 'subadmincontact', 'about'],
    1: ['username', 'password', 'reenterpassword', 'appname', 'invitecode'],
  };

  // Check if current step is valid
  const isCurrentStepValid = () => {
    const requiredFields = stepRequiredFields[activeStep] || [];
    
    // Check if all required fields are filled
    const allFieldsFilled = requiredFields.every(field => {
      const value = watchedValues[field];
      if (typeof value === 'string') {
        return value.trim() !== '';
      }
      return value !== null && value !== undefined;
    });

    if (!allFieldsFilled) return false;

    // Additional validation for step 1 (password matching)
    if (activeStep === 1) {
      const password = watchedValues.password;
      const reenterpassword = watchedValues.reenterpassword;
      
      // Check if passwords match
      if (password !== reenterpassword) {
        return false;
      }

      // Check minimum password length
      if (typeof password === 'string' && password.length < 8) {
        return false;
      }

      // Check username minimum length
      const username = watchedValues.username;
      if (typeof username === 'string' && username.length < 3) {
        return false;
      }
    }

    return true;
  };

  const handleClose = () => {
    try {
      setActiveStep(0);
      methods.reset();
    } catch (error) {
      notification.error(
        'Error',
        'Failed to reset form. Please try again.',
        { duration: 3000 }
      );
    }
  };

  // CHANGE 2: Added hasDataChanged function to compare current form values with last submitted values
  // Returns true if data has changed or no previous submission exists, false otherwise
  // Prevents API calls when clicking "Next" after going back without changes
  const hasDataChanged = (
    currentValues: Partial<FormData>,
    step: number
  ): boolean => {
    const lastSubmitted = submittedData[step];
    if (!lastSubmitted) return true; // No previous submission, treat as changed

    return Object.keys(currentValues).some(key => {
      const current = currentValues[key as keyof FormData];
      const last = lastSubmitted[key as keyof FormData];
      return current !== last;
    });
  };

  const handleNext = async () => {
    // Check if current step is valid before proceeding
    if (!isCurrentStepValid()) return;
    
    const isValid = await methods.trigger();
    if (!isValid) return;

    const values = methods.getValues();

    // Define step-specific data to compare/store
    const stepData = {
      0: {
        name: values.subadminname,
        email: values.subadminmail,
        contact: values.subadmincontact,
        about: values.about,
        logo: values.logo,
      },
      1: {
        subadmin_id: subAdminId,
        username: values.username,
        password: values.password,
        re_entered_password: values.reenterpassword,
        app_name: values.password,
        invite_code: values.invitecode,
      },
    }[activeStep];

    // Skip API call if data hasn't changed
    if (stepData && !hasDataChanged(stepData, activeStep)) {
      setActiveStep(prev => prev + 1);
      return;
    }

    try {
      switch (activeStep) {
        case 0: {
          const { subadmin_id } = await createProfile(
            values.subadminname,
            values.subadminmail,
            values.subadmincontact,
            values.about,
            values.logo
          );
          setSubAdminId(subadmin_id);
          break;
        }
        case 1:
          await createCredentials(
            subAdminId,
            values.username,
            values.password,
            values.reenterpassword,
            values.appname,
            values.invitecode
          );
          await shareDetails(subAdminId);
          queryClient.invalidateQueries(QueryEnums.SubAdmins);
          break;
        default:
          return null;
      }
      // Store the submitted data for this step
      setSubmittedData(prev => ({ ...prev, [activeStep]: stepData }));
      setActiveStep(prev => prev + 1);
    } catch {
      // ignore error
    }
  };

  const renderStep = () => {
    switch (activeStep) {
      case 0:
        return <StepSubAdmin1 />;
      case 1:
        return <StepSubAdmin2 />;
      case 2:
        return <OverviewStep subAdminId={subAdminId} />;
      default:
        return null;
    }
  };

  return (
    <DialogContent
      hideCloseButton={true}
      className="bg-white border border-gray-200 rounded-lg shadow-xl sm:max-w-4xl max-h-[90vh] p-0"
      aria-describedby={undefined}
      onInteractOutside={e => e.preventDefault()}
    >
      <DialogHeader className="border-b border-gray-200 p-6">
        <DialogTitle className="text-2xl font-semibold text-gray-900 flex items-center justify-between">
          Create Sub Admin
          <DialogClose
            asChild
            className="border border-gray-300 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer transition-colors"
          >
            <span className="p-2" onClick={handleClose}>
              <X className="w-5 h-5 text-gray-600" />
            </span>
          </DialogClose>
        </DialogTitle>
      </DialogHeader>
      <div className="flex flex-col h-[calc(90vh-120px)]">
        <FormProvider {...methods}>
          <div className="overflow-y-auto flex-1 p-6">
            {renderStep()}
          </div>
        </FormProvider>
        {activeStep < 2 && (
          <DialogFooter className="border-t border-gray-200 bg-gray-50 p-4">
            <div className="w-full flex justify-between gap-3 items-center">
              <Button
                type="button"
                className="border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 rounded-lg px-6 py-2.5 font-medium transition-colors"
                disabled={activeStep === 0}
                onClick={() => setActiveStep(prev => prev - 1)}
              >
                Back
              </Button>
              <Button
                type="button"
                className={`rounded-lg px-6 py-2.5 font-medium transition-colors ${
                  isCurrentStepValid()
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                onClick={handleNext}
                disabled={!isCurrentStepValid()}
              >
                {activeStep === 1 ? 'Create Sub Admin' : 'Next'}
              </Button>
            </div>
          </DialogFooter>
        )}
      </div>
    </DialogContent>
  );
}

export default CreateSubAdminDialog;

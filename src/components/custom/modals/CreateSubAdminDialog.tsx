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
import { Step, Stepper } from 'react-form-stepper';
import { styleConfig, subAdminStepsList } from '@/constants/dealsConstant';
import { FormProvider, useForm } from 'react-hook-form';
import OverviewStep from '../subAdminStepComponents/OverviewStep';
import StepSubAdmin1 from '../subAdminStepComponents/StepSubAdmin1';
import StepSubAdmin2 from '../subAdminStepComponents/StepSubAdmin2';
import { createCredentials, createProfile } from '@/axioscalls/dealApiServices';
import toast from 'react-hot-toast';

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

  const handleClose = () => {
    try {
      setActiveStep(0);
      methods.reset();
      toast.success('Sub Admin created successfully!');
    } catch (error) {
      toast.error(String(error));
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
          break;
        default:
          return null;
      }
      // Store the submitted data for this step
      setSubmittedData(prev => ({ ...prev, [activeStep]: stepData }));
      setActiveStep(prev => prev + 1);
    } catch (error) {
      console.error('Error submitting step:', error);
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
      className="w-[800px] rounded-none bg-[#1a1a1a] text-white border-none"
      aria-describedby={undefined}
      onInteractOutside={e => e.preventDefault()}
    >
      <DialogHeader>
        <DialogTitle className="text-3xl text-white flex items-center justify-between">
          Create a Sub-Admin
          <DialogClose
            asChild
            className="border-[1px] border-[#383739] bg-[#242325]"
          >
            <span className="p-1" onClick={handleClose}>
              <X />
            </span>
          </DialogClose>
        </DialogTitle>
        <hr />
      </DialogHeader>
      {activeStep !== 2 && (
        <Stepper
          activeStep={activeStep}
          styleConfig={styleConfig}
          style={{ padding: 0 }}
        >
          {subAdminStepsList.map(step => (
            <Step key={step.index} label={step.label} index={step.index} />
          ))}
        </Stepper>
      )}
      <FormProvider {...methods}>
        <div className="grid gap-4">{renderStep()}</div>
      </FormProvider>
      {activeStep < 2 && (
        <DialogFooter>
          <div className="w-full flex justify-between items-center">
            <Button
              type="button"
              className="bg-white rounded-none py-5"
              disabled={activeStep === 0}
              onClick={() => setActiveStep(prev => prev - 1)}
            >
              <div className="flex gap-2 mx-10 text-black">Back</div>
            </Button>
            <Button
              type="button"
              className="bg-white rounded-none py-5 hover:bg-zinc-300"
              onClick={handleNext}
            >
              <div className="flex gap-2 mx-10 text-black">
                {/* {activeStep === 1 ? "Submit" : "Next"} */}
                Next
              </div>
            </Button>
          </div>
        </DialogFooter>
      )}
    </DialogContent>
  );
}

export default CreateSubAdminDialog;

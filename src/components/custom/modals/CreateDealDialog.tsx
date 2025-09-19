import { Button } from '@/components/ui/button';
import {
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Dispatch, SetStateAction, useState } from 'react';
import {
  companyDetailsTrigger,
  customerSegmentTrigger,
  industryProblemTrigger,
  securitiesTrigger,
  valuationTrigger,
} from '@/axioscalls/apiServices';
import Step1 from '../stepComponents/Step1';
import { FormProvider, useForm } from 'react-hook-form';
import Step2 from '../stepComponents/Step2';
import Step3 from '../stepComponents/Step3';
import Step4 from '../stepComponents/Step4';
import Step5 from '../stepComponents/Step5';
import { X } from 'lucide-react';
import { useNotification } from '@/components/custom/NotificationProvider';
import { motion, AnimatePresence } from 'framer-motion';
import { useLoader } from '@/hooks/useLoader';
import StepperDemo from './StepperDemo';
import { invalidateDealsTableQuery } from '@/hooks/customhooks/DealsHooks/useDealTable';
import { useDealDraftId } from '@/hooks/customhooks/DealsHooks/useDealDraftId';
import isThisSubadmin from '@/lib/isSubadmin';

export interface FormData {
  companyName: string;
  aboutCompany: string;
  investmentSchemeAppendix: string;
  industry: string;
  problemStatement: string;
  businessModel: string;
  logo: File | null;
  companyStage: string;
  targetCustomerSegment: string;
  currentValuation: number | null;
  roundSize: number | null;
  syndicateCommitment: number | null;
  minimumInvestment: number | null;
  pitchDeck: File | null;
  pitchVideo: File | null;
  instrumentType: string;
  conversionTerms: string;
  managementFee?: number | null;
  carryPercentage?: number | null;
  isStartup: boolean;
  investmentSchemeAppendixFile?: File | null;
}

export default function CreateDealDialog({
  setIsDialogOpen,
}: {
  setIsDialogOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const [isSubadmin] = useState<boolean>(isThisSubadmin);
  const [activeStep, setActiveStep] = useState(0);
  const { showLoader, hideLoader } = useLoader();
  const notification = useNotification();
  const [submittedData, setSubmittedData] = useState<
    Partial<Record<number, Partial<FormData>>>
  >({});
  const methods = useForm<FormData>({
    defaultValues: {
      companyName: '',
      aboutCompany: '',
      investmentSchemeAppendix: '',
      industry: '',
      problemStatement: '',
      businessModel: '',
      logo: null,
      companyStage: '',
      targetCustomerSegment: '',
      currentValuation: null,
      roundSize: null,
      syndicateCommitment: null,
      minimumInvestment: null,
      pitchDeck: null,
      pitchVideo: null,
      investmentSchemeAppendixFile: null,
      instrumentType: '',
      conversionTerms: '',
      managementFee: null,
      carryPercentage: null,
      isStartup: false,
    },
    mode: 'onChange',
  });

  // Define required fields for each step
  const stepRequiredFields: Record<number, (keyof FormData)[]> = {
    0: ['companyName', 'aboutCompany', 'investmentSchemeAppendix', 'logo'],
    1: ['industry', 'problemStatement', 'businessModel'],
    2: ['companyStage', 'targetCustomerSegment'],
    3: ['currentValuation', 'roundSize', 'syndicateCommitment', 'minimumInvestment', 'pitchDeck', 'pitchVideo', 'investmentSchemeAppendixFile'],
    4: ['instrumentType', 'conversionTerms', 'managementFee', 'carryPercentage'],
  };

  // Watch all form values to trigger re-validation
  const watchedValues = methods.watch();

  // Check if current step is valid
  const isCurrentStepValid = () => {
    const requiredFields = stepRequiredFields[activeStep] || [];
    
    return requiredFields.every(field => {
      const value = watchedValues[field];
      if (typeof value === 'string') {
        return value.trim() !== '';
      }
      return value !== null && value !== undefined;
    });
  };
  // const dispatch = useAppDispatch();
  const { data: dealData, refetch } = useDealDraftId(isSubadmin);

  const renderStep = () => {
    switch (activeStep) {
      case 0:
        return <Step1 />;
      case 1:
        return <Step2 />;
      case 2:
        return <Step3 />;
      case 3:
        return <Step4 />;
      case 4:
        return <Step5 />;
      default:
        return null;
    }
  };

  const hasDataChanged = (
    currentValues: Partial<FormData>,
    step: number
  ): boolean => {
    const lastSubmitted = submittedData[step];
    if (!lastSubmitted) return true;

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
        companyName: values.companyName,
        aboutCompany: values.aboutCompany,
        investmentSchemeAppendix: values.investmentSchemeAppendix,
        logo: values.logo,
      },
      1: {
        industry: values.industry,
        problemStatement: values.problemStatement,
        businessModel: values.businessModel,
      },
      2: {
        companyStage: values.companyStage,
        targetCustomerSegment: values.targetCustomerSegment,
      },
      3: {
        currentValuation: values.currentValuation,
        roundSize: values.roundSize,
        syndicateCommitment: values.syndicateCommitment,
        pitchDeck: values.pitchDeck,
        pitchVideo: values.pitchVideo,
      },
      4: {
        instrumentType: values.instrumentType,
        conversionTerms: values.conversionTerms,
        isStartup: values.isStartup,
      },
    }[activeStep];

    // Skip API call if data hasn't changed
    if (stepData && !hasDataChanged(stepData, activeStep)) {
      setActiveStep(prev => prev + 1);
      return;
    }

    try {
      showLoader();
      switch (activeStep) {
        case 0: {
          await companyDetailsTrigger(
            values.companyName,
            values.aboutCompany,
            `AVF - ${values.investmentSchemeAppendix}`,
            values.logo,
            dealData?.deal_data?.id
          );
          break;
        }
        case 1:
          await industryProblemTrigger(
            values.industry,
            values.problemStatement,
            values.businessModel,
            dealData?.deal_data?.id
          );
          break;
        case 2:
          await customerSegmentTrigger(
            values.companyStage,
            values.targetCustomerSegment,
            dealData?.deal_data?.id
          );
          break;
        case 3:
          await valuationTrigger(
            values.currentValuation,
            values.roundSize,
            values.syndicateCommitment,
            values.minimumInvestment,
            values.pitchDeck,
            values.pitchVideo,
            values.investmentSchemeAppendixFile,
            dealData?.deal_data?.id
          );
          break;
        case 4:
          await securitiesTrigger(
            values.instrumentType,
            values.conversionTerms,
            values.isStartup,
            dealData?.deal_data?.id,
            values.managementFee,
            values.carryPercentage
          );
          setActiveStep(0);
          setSubmittedData({});
          methods.reset();
          setIsDialogOpen(false);
          invalidateDealsTableQuery(); // dispatch(fetchAllDeals());
          await refetch();
          break;
      }
      // Store the submitted data for this step
      setSubmittedData(prev => ({ ...prev, [activeStep]: stepData }));
      hideLoader();
      setActiveStep(prev => prev + 1);
    } catch (error) {
      hideLoader();
      notification.error(`Step ${activeStep + 1} Error`, `Error submitting step ${activeStep + 1}: ${error}`);
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
          Create a new deal
          <DialogClose
            asChild
            className="border border-gray-300 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer transition-colors"
          >
            <span className="p-2">
              <X className="w-5 h-5 text-gray-600" />
            </span>
          </DialogClose>
        </DialogTitle>
      </DialogHeader>
      <div className="flex h-[calc(90vh-120px)]">
        <div className="border-r border-gray-200 bg-gray-50">
          <StepperDemo activeStep={activeStep} setActiveStep={setActiveStep} />
        </div>
        <div className="flex flex-col w-full">
          <FormProvider {...methods}>
            <div className="grid gap-4 overflow-y-auto w-full p-6 flex-1">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStep}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                  {renderStep()}
                </motion.div>
              </AnimatePresence>
            </div>
          </FormProvider>
          {activeStep < 5 && (
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
                  {activeStep === 4 ? 'Submit' : 'Next'}
                </Button>
              </div>
            </DialogFooter>
          )}
        </div>
      </div>
    </DialogContent>
  );
}

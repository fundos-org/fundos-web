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
import toast from 'react-hot-toast';
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
      toast.error(`Error submitting step ${activeStep + 1}: ${error}`);
    }
  };

  return (
    <DialogContent
      hideCloseButton={true}
      className="border-0 rounded-none bg-[#1a1a1a] text-white sm:max-w-3xl max-h-[90vh]"
      aria-describedby={undefined}
      onInteractOutside={e => e.preventDefault()}
    >
      <DialogHeader>
        <DialogTitle className="text-3xl text-white flex items-center justify-between">
          Create a new deal
          <DialogClose
            asChild
            className="border-[1px] border-[#383739] bg-[#242325] cursor-pointer"
          >
            <span className="p-1">
              <X />
            </span>
          </DialogClose>
        </DialogTitle>
        <hr />
      </DialogHeader>
      <div className="flex">
        <StepperDemo activeStep={activeStep} setActiveStep={setActiveStep} />
        <div className="flex flex-col w-full">
          <FormProvider {...methods}>
            <div className="grid gap-4 overflow-hidden w-full pl-6 mb-10">
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
            <DialogFooter>
              <div className="w-full flex justify-end-safe gap-3 items-center">
                <Button
                  type="button"
                  className="border border-zinc-700 rounded-none py-5 hover:bg-[#38373990] cursor-pointer"
                  disabled={activeStep === 0}
                  onClick={() => setActiveStep(prev => prev - 1)}
                >
                  <div className="flex gap-2 mx-10 text-white hover:text-zinc-300">
                    Back
                  </div>
                </Button>
                <Button
                  type="button"
                  className="bg-white rounded-none py-5 hover:bg-zinc-300 cursor-pointer"
                  onClick={handleNext}
                >
                  <div className="flex gap-2 mx-10 text-black">
                    {activeStep === 4 ? 'Submit' : 'Next'}
                  </div>
                </Button>
              </div>
            </DialogFooter>
          )}
        </div>
      </div>
    </DialogContent>
  );
}

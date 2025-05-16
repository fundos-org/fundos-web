import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Step, Stepper } from "react-form-stepper";
import createDraft, {
  companyDetailsTrigger,
  customerSegmentTrigger,
  industryProblemTrigger,
  securitiesTrigger,
  valuationTrigger,
} from "@/axioscalls/dealApiServices";
import {
  stepsList,
  styleConfig,
} from "@/constants/dealsConstant";
import Step1 from "./stepComponents/Step1";
import { FormProvider, useForm } from "react-hook-form";
import Step2 from "./stepComponents/Step2";
import Step3 from "./stepComponents/Step3";
import Step4 from "./stepComponents/Step4";
import Step5 from "./stepComponents/Step5";
import CompletionStep from "./stepComponents/CompletedStep";
import { useAppDispatch, useAppStateEvent } from "@/app/hooks";
import { RootState } from "@/app/store";
import { unwrapResult } from "@reduxjs/toolkit";

export interface FormData {
  companyName: string;
  aboutCompany: string;
  companyWebsite: string;
  industry: string;
  problemStatement: string;
  businessModel: string;
  logo: File | null;
  companyStage: string;
  targetCustomerSegment: string;
  currentValuation: string;
  roundSize: string;
  syndicateCommitment: string;
  pitchDeck: File | null;
  pitchVideo: File | null;
  instrumentType: string;
  conversionTerms: string;
  isStartup: boolean;
}

export default function CreateDealDialog() {
  const [activeStep, setActiveStep] = useState(0);
  const [submittedData, setSubmittedData] = useState<
    Partial<Record<number, Partial<FormData>>>
  >({});
  const methods = useForm<FormData>({
    defaultValues: {
      companyName: "",
      aboutCompany: "",
      companyWebsite: "",
      industry: "",
      problemStatement: "",
      businessModel: "businessModel",
      logo: null,
      companyStage: "",
      targetCustomerSegment: "",
      currentValuation: "",
      roundSize: "",
      syndicateCommitment: "",
      pitchDeck: null,
      pitchVideo: null,
      instrumentType: "Equity",
      conversionTerms: "",
      isStartup: false,
    },
    mode: "onChange",
  });
  const dispatch = useAppDispatch();
  const {
    selected: { dealId },
  } = useAppStateEvent((state: RootState) => state.deals);

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
      case 5:
        return <CompletionStep setActiveStep={setActiveStep} setSubmittedData={setSubmittedData} reset={methods.reset} />;
      default:
        return null;
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

    return Object.keys(currentValues).some((key) => {
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
        companyWebsite: values.companyWebsite,
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
      setActiveStep((prev) => prev + 1);
      return;
    }

    try {
      switch (activeStep) {
        case 0: {
          const resultAction = await dispatch(createDraft());
          const {deal_id} = unwrapResult(resultAction);
          await companyDetailsTrigger(
            deal_id,
            values.companyName,
            values.aboutCompany,
            values.companyWebsite,
            values.logo
          );
          break;
        }
        case 1:
          await industryProblemTrigger(
            dealId,
            values.industry,
            values.problemStatement,
            values.businessModel
          );
          break;
        case 2:
          await customerSegmentTrigger(
            dealId,
            values.companyStage,
            values.targetCustomerSegment
          );
          break;
        case 3:
          await valuationTrigger(
            dealId,
            values.currentValuation,
            values.roundSize,
            values.syndicateCommitment,
            values.pitchDeck,
            values.pitchVideo
          );
          break;
        case 4:
          await securitiesTrigger(
            dealId,
            values.instrumentType,
            values.conversionTerms,
            values.isStartup
          );
          break;
      }
      // Store the submitted data for this step
      setSubmittedData((prev) => ({ ...prev, [activeStep]: stepData }));
      setActiveStep((prev) => prev + 1);
    } catch (error) {
      console.error("Error submitting step:", error);
    }
  };

  return (
    <DialogContent className="border-0 w-[800px] rounded-none bg-[#1a1a1a] text-white">
      <DialogHeader>
        <DialogTitle className="text-3xl text-white">
          Create a new deal
        </DialogTitle>
        <hr />
      </DialogHeader>
      <Stepper activeStep={activeStep} styleConfig={styleConfig} style={{padding: 0}}>
        {stepsList.map((step) => (
          <Step key={step.index} label={step.label} index={step.index} />
        ))}
      </Stepper>
      <FormProvider {...methods}>
        <div className="grid gap-4">{renderStep()}</div>
      </FormProvider>
      {activeStep < 5 && (
        <DialogFooter>
          <div className="w-full flex justify-between items-center">
            <Button
              type="button"
              className="bg-white rounded-none py-5"
              disabled={activeStep === 0}
              onClick={() => setActiveStep((prev) => prev - 1)}>
              <div className="flex gap-2 mx-10 text-black">Back</div>
            </Button>
            <Button
              type="button"
              className="bg-white rounded-none py-5 hover:bg-zinc-300"
              onClick={handleNext}>
              <div className="flex gap-2 mx-10 text-black">
                {activeStep === 4 ? "Submit" : "Next"}
              </div>
            </Button>
          </div>
        </DialogFooter>
      )}
    </DialogContent>
  );
}

import { Dispatch, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import { CheckCircle, Check } from "lucide-react";
import { UseFormReset } from "react-hook-form";
import { useAppDispatch } from "@/app/hooks";
import { resetDealId } from "@/slices/dealSlice";

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

type CompletionStepProps = {
  setActiveStep: Dispatch<SetStateAction<number>>;
  setSubmittedData: Dispatch<
    SetStateAction<Partial<Record<number, Partial<FormData>>>>
  >;
  reset: UseFormReset<FormData>;
};

const CompletionStep = ({
  setActiveStep,
  setSubmittedData,
  reset,
}: CompletionStepProps) => {
  const dispatch = useAppDispatch();
  const handleClose = () => {
    try {
      setActiveStep(0);
      setSubmittedData({});
      reset();
      dispatch(resetDealId());
    } catch (error) {
      console.log(error, "completeStep comp try catch handleclose");
    }
  };
  return (
    <div className="flex items-center justify-center py-15">
      <div className="text-center max-w-md w-full">
        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-4 text-white">
          Congratulations, you have created a deal!
        </h1>
        <DialogClose asChild>
          <Button
            className="bg-white text-black px-6 py-2 rounded-none hover:bg-zinc-700 transition-colors flex items-center justify-center mx-auto"
            onClick={handleClose}>
            <Check className="w-5 h-5 mr-2" />
            Okay
          </Button>
        </DialogClose>
      </div>
    </div>
  );
};

export default CompletionStep;

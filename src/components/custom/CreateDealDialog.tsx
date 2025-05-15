import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Step, Stepper } from "react-form-stepper";
import createDealDialogHook from "@/hooks/createDealDialogHook";
import {
  companyDetailsTrigger,
  customerSegmentTrigger,
  industryProblemTrigger,
  securitiesTrigger,
  valuationTrigger,
} from "@/axioscalls/dealApiServices";
import { stepsList, styleConfig } from "@/constants/dealsConstant";

export default function CreateDealDialog({ dealId }: { dealId: string }) {
  const [activeStep, setActiveStep] = useState(0);
  const [steps] = useState(stepsList);
  const [companyName, setCompanyName] = useState("");
  const [aboutCompany, setAboutCompany] = useState("");
  const [companyWebsite, setCompanyWebsite] = useState("");
  const [industry, setIndustry] = useState("");
  const [problemStatement, setProblemStatement] = useState("");
  const [businessModel, setBusinessModel] = useState("businessModel");
  const [logo, setLogo] = useState<File | null>(null);
  const [companyStage, setCompanyStage] = useState("");
  const [targetCustomerSegment, setTargetCustomerSegment] = useState("");
  const [currentValuation, setCurrentValuation] = useState("");
  const [roundSize, setRoundSize] = useState("");
  const [syndicateCommitment, setSyndicateCommitment] = useState("");
  const [pitchDeck, setPitchDeck] = useState<File | null>(null);
  const [pitchVideo, setPitchVideo] = useState<File | null>(null);
  const [instrumentType, setInstrumentType] = useState("Equity");
  const [conversionTerms, setConversionTerms] = useState("");
  const [isStartup, setIsStartup] = useState(false);

  const { switchCaseJsx } = createDealDialogHook(
    companyName,
    setCompanyName,
    aboutCompany,
    setAboutCompany,
    companyWebsite,
    setCompanyWebsite,
    industry,
    setIndustry,
    problemStatement,
    setProblemStatement,
    businessModel,
    setBusinessModel,
    logo,
    setLogo,
    companyStage,
    setCompanyStage,
    targetCustomerSegment,
    setTargetCustomerSegment,
    currentValuation,
    setCurrentValuation,
    roundSize,
    setRoundSize,
    syndicateCommitment,
    setSyndicateCommitment,
    pitchDeck,
    setPitchDeck,
    pitchVideo,
    setPitchVideo,
    instrumentType,
    setInstrumentType,
    conversionTerms,
    setConversionTerms,
    isStartup,
    setIsStartup
  );

  const handleNextBtnChange = async () => {
    switch (activeStep) {
      case 0:
        await companyDetailsTrigger(
          dealId,
          companyName,
          aboutCompany,
          companyWebsite,
          logo
        );
        setActiveStep((prev) => prev + 1);
        break;
      case 1:
        await industryProblemTrigger(
          dealId,
          industry,
          problemStatement,
          businessModel
        );
        setActiveStep((prev) => prev + 1);
        break;
      case 2:
        await customerSegmentTrigger(
          dealId,
          companyStage,
          targetCustomerSegment
        );
        setActiveStep((prev) => prev + 1);
        break;
      case 3:
        await valuationTrigger(
          dealId,
          currentValuation,
          roundSize,
          syndicateCommitment,
          pitchDeck,
          pitchVideo
        );
        setActiveStep((prev) => prev + 1);
        break;
      case 4:
        await securitiesTrigger(
          dealId,
          instrumentType,
          conversionTerms,
          isStartup
        );
        setActiveStep((prev) => prev + 1);
        break;
      default:
        break;
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
      <Stepper
        style={{ padding: 0 }}
        activeStep={activeStep}
        styleConfig={styleConfig}>
        {steps.map((step, index) => (
          <Step key={index} label={step.label} index={step.index} />
        ))}
      </Stepper>
      <div className="grid gap-4">{switchCaseJsx(activeStep)}</div>
      <DialogFooter>
        {activeStep < 5 && (
          <div className="w-full flex justify-between items-center">
            <Button
              type="button"
              className="bg-white rounded-none py-5 hover:bg-zinc-300"
              disabled={activeStep == 0}
              onClick={() => setActiveStep((prev) => prev - 1)}>
              <div className="flex gap-2 mx-10 text-black">Back</div>
            </Button>
            <Button
              // disabled={activeStep == 4}
              type="button"
              className="bg-white rounded-none py-5 hover:bg-zinc-300"
              onClick={handleNextBtnChange}>
              <div className="flex gap-2 mx-10 text-black">
                {activeStep == 4 ? "Submit" : "Next"}
              </div>
            </Button>
          </div>
        )}
      </DialogFooter>
    </DialogContent>
  );
}

import { X } from "lucide-react";
import {
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { useState } from "react";
import { Button } from "../ui/button";
import { Step, Stepper } from "react-form-stepper";
import { styleConfig, subAdminStepsList } from "@/constants/dealsConstant";
import { FormProvider, useForm } from "react-hook-form";
import OverviewStep from "./subAdminStepComponents/OverviewStep";
import StepSubAdmin1 from "./subAdminStepComponents/StepSubAdmin1";
import StepSubAdmin2 from "./subAdminStepComponents/StepSubAdmin2";

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
  const methods = useForm<FormData>({
    defaultValues: {
      logo: null,
      subadminname: "",
      subadminmail: "",
      subadmincontact: "",
      about: "",
      username: "",
      password: "",
      reenterpassword: "",
      appname: "",
      invitecode: "",
    },
    mode: "onChange",
  });

  const renderStep = () => {
    switch (activeStep) {
      case 0:
        return <StepSubAdmin1 />;
      case 1:
        return <StepSubAdmin2 />;
      case 2:
        return (
          <OverviewStep setActiveStep={setActiveStep} reset={methods.reset} />
        );
      default:
        return null;
    }
  };

  return (
    <DialogContent
      hideCloseButton={true}
      className="border-0 w-[800px] rounded-none bg-[#1a1a1a] text-white"
      aria-describedby={undefined}
      onInteractOutside={(e) => e.preventDefault()}>
      <DialogHeader>
        <DialogTitle className="text-3xl text-white flex items-center justify-between">
          Create a Sub-Admin
          <DialogClose
            asChild
            className="border-[1px] border-[#383739] bg-[#242325]">
            <span className="p-1">
              <X />
            </span>
          </DialogClose>
        </DialogTitle>
        <hr />
      </DialogHeader>
      <Stepper
        activeStep={activeStep}
        styleConfig={styleConfig}
        style={{ padding: 0 }}>
        {subAdminStepsList.map((step) => (
          <Step key={step.index} label={step.label} index={step.index} />
        ))}
      </Stepper>
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
              onClick={() => setActiveStep((prev) => prev - 1)}>
              <div className="flex gap-2 mx-10 text-black">Back</div>
            </Button>
            <Button
              type="button"
              className="bg-white rounded-none py-5 hover:bg-zinc-300" onClick={() => setActiveStep(2)}>
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

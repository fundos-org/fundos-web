import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";
import { useState } from "react";
import { Step, Stepper } from "react-form-stepper";
import { StepStyleDTO } from "react-form-stepper/dist/components/Step/StepTypes";
import createDealDialogHook from "@/hooks/createDealDialogHook";

export type Stages = {
  value: string;
  title: string;
  description: string;
};

const targetCustomers = ["B2B", "B2C", "B2B2C", "Enterprise"];
const securities = ["Equity", "Debt", "Hybrid", "Derivative"];
const stepsList = [
  { label: "Comapany", index: 0 },
  { label: "Industry", index: 1 },
  { label: "Customer", index: 2 },
  { label: "Valuation", index: 3 },
  { label: "Security", index: 4 },
];
const businessModels = [
  "SaaS",
  "E-commerce",
  "Marketplace",
  "Enterprise",
  "Transactional",
  "Usage Based",
  "Advertising",
  "Subscription",
];
const stages: Stages[] = [
  {
    value: "idea-stage",
    title: "Idea stage",
    description: "Brainstorming and alidating problem statement",
  },
  {
    value: "pre-seed-stage",
    title: "Pre-seed stage",
    description: "Building MVP (Minimum viable product)",
  },
  {
    value: "seed-stage",
    title: "Seed stage",
    description: "Building MVP (Minimum viable product)",
  },
  {
    value: "series-a",
    title: "Series A",
    description: "Building MVP (Minimum viable product)",
  },
  {
    value: "series-b",
    title: "Series B",
    description: "Building MVP (Minimum viable product)",
  },
  {
    value: "series-c",
    title: "Series C",
    description: "Building MVP (Minimum viable product)",
  },
];
// , children: "✓"

const styleConfig = {
  activeBgColor: "#fff",
  activeTextColor: "#000",
  inactiveBgColor: "#1a1a1a",
  completedBgColor: "#2a2a2a",
  borderRadius: 0,
} as StepStyleDTO;

export default function CreateDealDialog() {
  const [activeStep, setActiveStep] = useState(3);
  const [steps] = useState(stepsList);
  const { switchCaseJsx } = createDealDialogHook(
    businessModels,
    stages,
    targetCustomers,
    securities
  );
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
        <div className="w-full flex justify-between items-center">
          <Button
            type="button"
            className="bg-white rounded-none py-5"
            disabled={activeStep == 0}
            onClick={() => setActiveStep((prev) => prev - 1)}>
            <div className="flex gap-2 mx-10 text-black">Back</div>
          </Button>
          <Button
            disabled={activeStep == 4}
            type="button"
            className="bg-white rounded-none py-5"
            onClick={() => setActiveStep((prev) => prev + 1)}>
            <div className="flex gap-2 mx-10 text-black">Next</div>
          </Button>
        </div>
      </DialogFooter>
    </DialogContent>
  );
}

export function FileUploadBox() {
  return (
    <>
      <Label
        htmlFor="file-upload"
        className="w-full flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-none p-6">
        <Upload className="w-10 h-10 text-gray-400 mb-4" />
        <p className="text-gray-500 mb-2">Drag and Drop Logo</p>
      </Label>
      <input id="file-upload" type="file" accept="image/*" className="hidden" />
    </>
  );
}

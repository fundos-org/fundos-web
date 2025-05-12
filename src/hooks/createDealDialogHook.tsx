import { FileUploadBox, Stages } from "@/components/custom/CreateDealDialog";
import CustomRadioButtonGroup from "@/components/custom/CustomRadioButtonGroup";
import CustomToggleGroup from "@/components/custom/CustomToggleGroup";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

function createDealDialogHook(
  businessModels: string[],
  stages: Stages[],
  targetCustomers: string[],
  securities: string[]
) {
  const switchCaseJsx = (key: number) => {
    switch (key) {
      case 0:
        return (
          <>
            <FileUploadBox />
            <div className="flex flex-col gap-2">
              <Label htmlFor="companyname" className="text-right text-white">
                Company Name
              </Label>
              <Input id="companyname" className="rounded-none text-white" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="aboutcompany" className="text-right text-white">
                About Company
              </Label>
              <Textarea id="aboutcompany" className="rounded-none text-white" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="companywebsite" className="text-right text-white">
                Company Website
              </Label>
              <Input id="companywebsite" className="rounded-none text-white" />
            </div>
          </>
        );
        break;

      case 1:
        return (
          <>
            <div className="flex flex-col gap-2">
              <Label htmlFor="companyname" className="text-right text-white">
                Industry
              </Label>
              <Select>
                <SelectTrigger className="w-full rounded-none text-white">
                  <SelectValue placeholder="Select Industry" />
                </SelectTrigger>
                <SelectContent className="rounded-none text-white bg-[#1a1a1a]">
                  <SelectGroup>
                    {businessModels.map((model) => (
                      <SelectItem key={model} value={model}>
                        {model}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="aboutcompany" className="text-right text-white">
                Problem Statement
              </Label>
              <Textarea
                id="aboutcompany"
                placeholder="Describe problem statement"
                className="rounded-none text-white"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="companywebsite" className="text-right text-white">
                Company Website
              </Label>
              <CustomToggleGroup array={businessModels} />
            </div>
          </>
        );
        break;

      case 2:
        return (
          <>
            <div className="flex flex-col gap-2">
              <Label htmlFor="companyname" className="text-right text-white">
                Target Customer Segment
              </Label>
              <CustomRadioButtonGroup stages={stages} />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="companywebsite" className="text-right text-white">
                Target Customer Segment
              </Label>
              <CustomToggleGroup array={targetCustomers} />
            </div>
          </>
        );
        break;

      case 3:
        return (
          <>
            <div className="flex flex-col gap-2">
              <Label htmlFor="companyname" className="text-right text-white">
                Current Valuation (INR)
              </Label>
              <Input
                id="companyname"
                placeholder="Enter current valuation"
                className="rounded-none text-white"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="companyname" className="text-right text-white">
                Round Size (INR)
              </Label>
              <Input
                id="companyname"
                placeholder="Enter round size"
                className="rounded-none text-white"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="companyname" className="text-right text-white">
                Syndicate Commitment (INR)
              </Label>
              <Input
                id="companyname"
                placeholder="Enter syndicate commitment"
                className="rounded-none text-white"
              />
            </div>
          </>
        );
        break;

      default:
        return (
          <>
            <div className="flex flex-col gap-2">
              <Label htmlFor="companyname" className="text-right text-white">
                Instrument (Types of Securities)
              </Label>
              <CustomToggleGroup array={securities} />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="companyname" className="text-right text-white">
                Conversion Terms
              </Label>
              <Textarea
                id="aboutcompany"
                placeholder="Describe conversion terms"
                className="rounded-none text-white"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="terms" />
              <label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                I agree that the Company is a Startup as per applicable
                provisions of the SEBI (Alternative Investment Funds)
                Regulations, 2012
              </label>
            </div>
          </>
        );
        break;
    }
  };

  return { switchCaseJsx };
}

export default createDealDialogHook;

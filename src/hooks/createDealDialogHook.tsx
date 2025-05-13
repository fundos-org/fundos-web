import { Stages } from "@/components/custom/CreateDealDialog";
import CustomRadioButtonGroup from "@/components/custom/CustomRadioButtonGroup";
import CustomToggleGroup from "@/components/custom/CustomToggleGroup";
import ImageInput from "@/components/custom/ImageUpload";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DialogClose } from "@/components/ui/dialog";
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
import { Check, CheckCircle } from "lucide-react";

function useCreateDealDialogHook(
  businessModels: string[],
  stages: Stages[],
  targetCustomers: string[],
  securities: string[],
  companyName: string,
  setCompanyName: React.Dispatch<React.SetStateAction<string>>,
  aboutCompany: string,
  setAboutCompany: React.Dispatch<React.SetStateAction<string>>,
  companyWebsite: string,
  setCompanyWebsite: React.Dispatch<React.SetStateAction<string>>,
  industry: string,
  setIndustry: React.Dispatch<React.SetStateAction<string>>,
  problemStatement: string,
  setProblemStatement: React.Dispatch<React.SetStateAction<string>>,
  businessModel: string,
  setBusinessModel: React.Dispatch<React.SetStateAction<string>>,
  logo: File | null,
  setLogo: React.Dispatch<React.SetStateAction<File | null>>,
  companyStage: string,
  setCompanyStage: React.Dispatch<React.SetStateAction<string>>,
  targetCustomerSegment: string,
  setTargetCustomerSegment: React.Dispatch<React.SetStateAction<string>>,
  currentValuation: string,
  setCurrentValuation: React.Dispatch<React.SetStateAction<string>>,
  roundSize: string,
  setRoundSize: React.Dispatch<React.SetStateAction<string>>,
  syndicateCommitment: string,
  setSyndicateCommitment: React.Dispatch<React.SetStateAction<string>>,
  pitchDeck: File | null,
  setPitchDeck: React.Dispatch<React.SetStateAction<File | null>>,
  pitchVideo: File | null,
  setPitchVideo: React.Dispatch<React.SetStateAction<File | null>>,
  instrumentType: string,
  setInstrumentType: React.Dispatch<React.SetStateAction<string>>,
  conversionTerms: string,
  setConversionTerms: React.Dispatch<React.SetStateAction<string>>,
  isStartup: boolean,
  setIsStartup: React.Dispatch<React.SetStateAction<boolean>>,
) {
  const switchCaseJsx = (key: number) => {
    switch (key) {
      case 0:
        return (
          <>
            <Label htmlFor="companyname" className="text-right text-white">
              Upload Logo
            </Label>
            <ImageInput image={logo} id="logo" setImage={setLogo} />
            <div className="flex flex-col gap-2">
              <Label htmlFor="companyname" className="text-right text-white">
                Company Name
              </Label>
              <Input
                id="companyname"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Enter company name"
                className="rounded-none text-white"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="aboutcompany" className="text-right text-white">
                About Company
              </Label>
              <Textarea
                id="aboutcompany"
                value={aboutCompany}
                onChange={(e) => setAboutCompany(e.target.value)}
                placeholder="Enter about company"
                className="rounded-none text-white"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="companywebsite" className="text-right text-white">
                Company Website
              </Label>
              <Input
                id="companywebsite"
                value={companyWebsite}
                onChange={(e) => setCompanyWebsite(e.target.value)}
                placeholder="Enter company website"
                className="rounded-none text-white"
              />
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
              <Select onValueChange={setIndustry} defaultValue={industry}>
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
                value={problemStatement}
                onChange={(e) => setProblemStatement(e.target.value)}
                placeholder="Describe problem statement"
                className="rounded-none text-white"
              />
            </div>
            <div className="flex flex-col gap-2 mb-10">
              <Label htmlFor="companywebsite" className="text-right text-white">
                Company Website
              </Label>
              <CustomToggleGroup
                array={businessModels}
                value={businessModel}
                setValue={setBusinessModel}
              />
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
              <CustomRadioButtonGroup
                value={companyStage}
                setValue={setCompanyStage}
                stages={stages}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="companywebsite" className="text-right text-white">
                Target Customer Segment
              </Label>
              <CustomToggleGroup
                value={targetCustomerSegment}
                array={targetCustomers}
                setValue={setTargetCustomerSegment}
              />
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
                value={currentValuation}
                onChange={(e) => setCurrentValuation(e.target.value)}
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
                value={roundSize}
                onChange={(e) => setRoundSize(e.target.value)}
                placeholder="Enter round size"
                className="rounded-none text-white"
              />
            </div>
            <div className="flex flex-col gap-2 mb-10">
              <Label htmlFor="companyname" className="text-right text-white">
                Syndicate Commitment (INR)
              </Label>
              <Input
                id="companyname"
                value={syndicateCommitment}
                onChange={(e) => setSyndicateCommitment(e.target.value)}
                placeholder="Enter syndicate commitment"
                className="rounded-none text-white"
              />
            </div>
            <Label htmlFor="companyname" className="text-right text-white">
              Upload Pitch Deck
            </Label>
            <ImageInput
              image={pitchDeck}
              id="pitchDeck"
              setImage={setPitchDeck}
            />
            <Label htmlFor="companyname" className="text-right text-white">
              Upload Pitch Video
            </Label>
            <ImageInput
              image={pitchVideo}
              id="pitchVideo"
              setImage={setPitchVideo}
            />
          </>
        );
        break;

      case 4:
        return (
          <>
            <div className="flex flex-col gap-2">
              <Label htmlFor="companyname" className="text-right text-white">
                Instrument (Types of Securities)
              </Label>
              <CustomToggleGroup
                value={instrumentType}
                array={securities}
                setValue={setInstrumentType}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="companyname" className="text-right text-white">
                Conversion Terms
              </Label>
              <Textarea
                id="aboutcompany"
                value={conversionTerms}
                onChange={(e) => setConversionTerms(e.target.value)}
                placeholder="Describe conversion terms"
                className="rounded-none text-white"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                checked={isStartup}
                onCheckedChange={(checked) => setIsStartup(checked === true)}
              />
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

      default:
        return (
            <div className=" flex items-center justify-center py-15">
              <div className="text-center max-w-md w-full">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h1 className="text-2xl font-bold mb-4">
                  Congratulations, you have created a deal!
                </h1>
                <DialogClose>
                  <Button className="bg-white text-black px-6 py-2 rounded-none hover:bg-zinc-700 transition-colors flex items-center justify-center mx-auto">
                    <Check className="w-5 h-5 mr-2" />
                    Okay
                  </Button>
                </DialogClose>
              </div>
            </div>
        );
    }
  };

  return { switchCaseJsx };
}

export default useCreateDealDialogHook;

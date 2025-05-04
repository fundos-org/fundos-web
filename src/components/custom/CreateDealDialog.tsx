import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MoveRight, Upload } from "lucide-react";

export default function CreateDealDialog() {
  return (
    <DialogContent className="border-0 max-w-[550px] rounded-none bg-[#1a1a1a] text-white">
      <DialogHeader>
        <DialogTitle className="text-3xl text-white">
          Create a new deal
        </DialogTitle>
        <hr />
      </DialogHeader>
      <div className="grid gap-4">
        <div className="w-full mt-3 flex justify-between items-center">
          <div className="w-full bg-zinc-800">
            <div className="bg-white text-xs font-medium text-black text-center leading-none w-45">
              45%
            </div>
          </div>
        </div>
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
      </div>
      <DialogFooter className="w-[330px] flex justify-center mt-5">
        <Button type="submit" className="bg-white rounded-none py-5">
          <div className="flex gap-2 mx-10 text-black">
            Next <MoveRight />
          </div>
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}

export function FileUploadBox() {
  return (
    <>
      <Label htmlFor="file-upload" className="w-full flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-none p-6">
        <Upload className="w-10 h-10 text-gray-400 mb-4" />
        <p className="text-gray-500 mb-2">Drag and Drop Logo</p>
      </Label>
      <input id="file-upload" type="file" accept="image/*" className="hidden" />
    </>
  );
}

import { FileSpreadsheet, CloudUpload, Users, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../ui/dialog';
import { FC } from 'react';
import { Button } from '../../ui/button';

const BulkOnboardInstructions: FC<{
  open: boolean;
  setOpen: (open: boolean) => void;
}> = ({ open, setOpen }) => {
  return (
    <Dialog open={open} onOpenChange={open => setOpen(!open)}>
      <DialogContent
        className="border-0 rounded-none bg-[#181C23] text-white sm:max-w-2xl min-h-[50vh] max-h-[90vh]"
        hideCloseButton={true}
        aria-describedby={undefined}
      >
        <div className="text-white rounded-none">
          <DialogHeader>
            <DialogTitle className="text-3xl text-white flex items-center justify-between">
              How bulk onboard works?
              <Button
                onClick={() => setOpen(false)}
                className="border-[1px] py-1 rounded-none border-[#383739] bg-[#242325] cursor-pointer"
              >
                <X />
              </Button>
            </DialogTitle>
            <hr className="border-[#232A36] my-2" />
          </DialogHeader>

          <div className="p-5">
            <div className="mb-8">
              <p className="text-gray-400">
                Here's a simple 3-step guide to get you started:
              </p>
            </div>
            <div className="space-y-6 mb-12">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-800 flex items-center justify-center">
                  <FileSpreadsheet className="w-6 h-6 text-gray-300" />
                </div>

                <span className="text-lg text-gray-300">
                  Download the template CSV file
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-800 flex items-center justify-center">
                  <CloudUpload className="w-6 h-6 text-gray-300" />
                </div>

                <span className="text-lg text-gray-300">
                  Fill & Upload your file (.csv or .xls under 10MB)
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-800 flex items-center justify-center">
                  <Users className="w-6 h-6 text-gray-300" />
                </div>

                <span className="text-lg text-gray-300">
                  Review and confirm to onboard members
                </span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BulkOnboardInstructions;

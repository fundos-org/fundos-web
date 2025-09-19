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
        className="bg-white border border-gray-200 rounded-lg shadow-xl sm:max-w-2xl max-h-[90vh] p-6"
        hideCloseButton={true}
        aria-describedby={undefined}
      >
        <div className="text-gray-900">
          <DialogHeader className="border-b border-gray-200 pb-4 mb-6">
            <DialogTitle className="text-2xl font-semibold text-gray-900 flex items-center justify-between">
              How Bulk Onboard Works?
              <Button
                onClick={() => setOpen(false)}
                className="border border-gray-300 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer transition-colors p-2"
              >
                <X className="w-5 h-5 text-gray-600" />
              </Button>
            </DialogTitle>
          </DialogHeader>

          <div>
            <div className="mb-8">
              <p className="text-gray-600">
                Here's a simple 3-step guide to get you started:
              </p>
            </div>
            <div className="space-y-6">
              <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="w-12 h-12 bg-blue-600 flex items-center justify-center rounded-lg">
                  <FileSpreadsheet className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="text-lg font-semibold text-gray-900 block">
                    Download the template
                  </span>
                  <span className="text-sm text-gray-600">
                    Get the CSV template file with the correct format
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="w-12 h-12 bg-green-600 flex items-center justify-center rounded-lg">
                  <CloudUpload className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="text-lg font-semibold text-gray-900 block">
                    Fill & Upload your file
                  </span>
                  <span className="text-sm text-gray-600">
                    Upload your completed file (.csv or .xls under 10MB)
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="w-12 h-12 bg-purple-600 flex items-center justify-center rounded-lg">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="text-lg font-semibold text-gray-900 block">
                    Review and confirm
                  </span>
                  <span className="text-sm text-gray-600">
                    Review the data and confirm to onboard members
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BulkOnboardInstructions;

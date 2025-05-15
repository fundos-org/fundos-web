import React from 'react';
import { Button } from '@/components/ui/button';
import { DialogClose } from '@/components/ui/dialog';
import { CheckCircle, Check } from 'lucide-react';

const CompletionStep: React.FC = () => {
  return (
    <div className="flex items-center justify-center py-15">
      <div className="text-center max-w-md w-full">
        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-4 text-white">
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
};

export default CompletionStep;
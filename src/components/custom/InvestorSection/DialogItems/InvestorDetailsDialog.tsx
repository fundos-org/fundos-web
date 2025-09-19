import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogTitle,
  DialogPortal,
} from '@radix-ui/react-dialog';
import { DialogHeader } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { ChevronLeft, X } from 'lucide-react';
import { FC, lazy, Suspense, useEffect } from 'react';
import { InvestorEntity } from '@/constants/membersConstant';
const InvestorMainTab = lazy(() => import('../TabItems/InvestorMainTab'));

const InvestorDetailsDialog: FC<{
  investor?: InvestorEntity | null;
  setInvestor?: (open: InvestorEntity | null) => void;
}> = ({ investor, setInvestor }) => {
  const {
    name,
    deals_invested,
    deals_committed,
    joined_on,
    profile_pic,
    type,
    capital_commitment,
    investor_id,
  } = investor ?? {};

  // Prevent background scrolling when modal is open
  useEffect(() => {
    const isOpen = investor && Object.keys(investor).length > 0;
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [investor]);

  return (
    <Dialog
      open={investor ? Object.keys(investor).length > 0 : false}
      onOpenChange={open => {
        if (!open) setInvestor?.(null);
      }}
    >
      <DialogPortal>
        {/* Overlay for background distinction - only when dialog is actually open */}
        {investor && Object.keys(investor).length > 0 && (
          <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm" />
        )}
        
        <DialogContent
        aria-describedby={undefined}
        className={cn(
          'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[250] p-6 rounded-lg shadow-xl bg-white w-[90vw] max-w-6xl h-[90vh] max-h-[800px] overflow-y-auto'
        )}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl text-gray-900 font-semibold flex items-center justify-between">
            <div className="flex justify-center items-center gap-3">
              <DialogClose
                asChild
                className="border border-gray-300 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer transition-colors"
              >
                <span className="p-2">
                  <ChevronLeft
                    className="w-5 h-5 text-gray-600 cursor-pointer"
                    onClick={() => setInvestor?.(null)}
                  />
                </span>
              </DialogClose>
              <span>Member Details</span>
            </div>
            <DialogClose
              asChild
              className="border border-gray-300 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer transition-colors"
            >
              <span className="p-2">
                <X className="w-5 h-5 text-gray-600" />
              </span>
            </DialogClose>
          </DialogTitle>
          <hr className="border-gray-200 my-4" />
          <div className="flex justify-between w-full">
            <div className="flex gap-6">
              <div className="w-24 h-24 overflow-hidden rounded-lg bg-gray-100 flex items-center justify-center">
                {profile_pic ? (
                  <img
                    src={profile_pic}
                    className="w-full h-full object-cover rounded-lg"
                    alt="Profile"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-gray-400 text-sm">No image</span>
                  </div>
                )}
              </div>
              <div className="flex flex-col justify-around">
                <h1 className="text-2xl font-bold text-gray-900">{name}</h1>
                <div className="w-full flex gap-3">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {type} Investor
                  </span>
                </div>
                <p className="text-gray-600">Joined on: {joined_on}</p>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <div className="flex gap-8 px-6 py-4 mt-4 bg-gray-50 rounded-lg">
                <div className="flex flex-col items-start">
                  <small className="text-gray-500 font-medium">Deals Invested</small>
                  <h2 className="text-3xl font-bold text-gray-900">
                    {deals_invested || 0}
                  </h2>
                </div>
                <div className="border-l border-gray-300 h-16"></div>
                <div className="flex flex-col items-start">
                  <small className="text-gray-500 font-medium">Deals Committed</small>
                  <h2 className="text-3xl font-bold text-gray-900">
                    {deals_committed || 0}
                  </h2>
                </div>
                <div className="border-l border-gray-300 h-16"></div>
                <div className="flex flex-col items-start">
                  <small className="text-gray-500 font-medium">Capital Committed</small>
                  <h2 className="text-3xl font-bold text-gray-900">
                    ₹{capital_commitment?.toLocaleString() || 0}
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </DialogHeader>
        <Suspense fallback={<div>Loading...</div>}>
          <InvestorMainTab investor_id={investor_id ?? ''} />
        </Suspense>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};

export default InvestorDetailsDialog;

import { cn } from '@/lib/utils';
import { ChevronLeft, X } from 'lucide-react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from '@radix-ui/react-dialog';
import { Dispatch, FC, SetStateAction, lazy, Suspense, useEffect } from 'react';
import { DealCard } from '@/constants/dealsConstant';
import { convertToCrores } from '@/lib/currencyToWords';
import { Progress } from '@/components/ui/progress';
import { useAwsFileObjectKey } from '@/hooks/useAwsFileObjectKey';
import { AWS_BUCKET_NAME } from '@/constants/enums';
import { DialogHeader } from '@/components/ui/dialog';
const DealMainTab = lazy(() => import('../TabItems/DealMainTab'));

const DealDetailsDialog: FC<{
  details?: DealCard | null;
  setDetails?: Dispatch<SetStateAction<DealCard | null>>;
}> = ({ details, setDetails }) => {
  const {
    logo_url,
    title,
    created_at,
    company_stage,
    business_model,
    commitment,
    round_size,
    fund_raised_till_now,
    deal_status,
    deal_id,
  } = details ?? {};
  const { data: logo } = useAwsFileObjectKey(AWS_BUCKET_NAME, logo_url ?? '');
  
  // Prevent background scrolling when modal is open
  useEffect(() => {
    const isOpen = details && Object.keys(details).length > 0;
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [details]);

  return (
    <Dialog
      open={details ? Object.keys(details).length > 0 : false}
      onOpenChange={open => {
        if (!open) setDetails?.(null);
      }}
    >
      {/* Overlay for background distinction */}
      <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" />
      
      <DialogContent
        aria-describedby={undefined}
        className={cn(
          'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 p-6 rounded-lg shadow-xl bg-white w-[90vw] max-w-6xl h-[90vh] max-h-[800px] overflow-y-auto'
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
                    onClick={() => setDetails?.(null)}
                  />
                </span>
              </DialogClose>
              <span>Deal Details</span>
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
                {logo ? (
                  <img
                    src={logo}
                    className="w-full h-full object-cover rounded-lg"
                    alt="Company logo"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-gray-400 text-sm">No logo</span>
                  </div>
                )}
              </div>
              <div className="flex flex-col justify-around">
                <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                <div className="w-full flex gap-3">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {business_model}
                  </span>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    {company_stage}
                  </span>
                </div>
                <p className="text-gray-600">Joined on: {created_at}</p>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <div 
                className={`flex items-center gap-2 px-4 py-2 rounded-full border font-medium text-sm ${
                  deal_status === 'OPEN' ? 'text-green-800 bg-green-100 border-green-200' :
                  deal_status === 'CLOSED' ? 'text-red-800 bg-red-100 border-red-200' :
                  deal_status === 'ON_HOLD' ? 'text-yellow-800 bg-yellow-100 border-yellow-200' :
                  'text-gray-800 bg-gray-100 border-gray-200'
                }`}
              >
                <div 
                  className={`w-2 h-2 rounded-full ${
                    deal_status === 'OPEN' ? 'bg-green-600' :
                    deal_status === 'CLOSED' ? 'bg-red-600' :
                    deal_status === 'ON_HOLD' ? 'bg-yellow-600' :
                    'bg-gray-600'
                  }`}
                />
                <span>
                  {deal_status === 'OPEN' ? 'Active' :
                   deal_status === 'CLOSED' ? 'Closed' :
                   deal_status === 'ON_HOLD' ? 'On Hold' :
                   'Unknown'}
                </span>
              </div>
              <div className="flex gap-8 px-6 py-4 mt-4 bg-gray-50 rounded-lg">
                <div className="flex flex-col items-start">
                  <small className="text-gray-500 font-medium">Commitments</small>
                  <h2 className="text-3xl font-bold text-gray-900">
                    {convertToCrores(commitment ?? 0)}
                  </h2>
                </div>
                <div className="border-l border-gray-300 h-16"></div>
                <div className="flex flex-col items-start">
                  <small className="text-gray-500 font-medium">Round Size</small>
                  <h2 className="text-3xl font-bold text-gray-900">
                    {convertToCrores(round_size ?? 0)}
                  </h2>
                </div>
              </div>
              <div className="w-full mt-4">
                <p className="text-sm text-gray-500 mb-2 font-medium">
                  {fund_raised_till_now ?? 0}% raised
                </p>
                <Progress
                  className="bg-gray-200 w-full rounded-full h-2 [&>div]:bg-blue-600"
                  value={fund_raised_till_now ?? 0}
                />
              </div>
            </div>
          </div>
        </DialogHeader>
        <Suspense fallback={<div>Loading...</div>}>
          <DealMainTab deal_id={deal_id ?? ''} />
        </Suspense>
      </DialogContent>
    </Dialog>
  );
};

export default DealDetailsDialog;

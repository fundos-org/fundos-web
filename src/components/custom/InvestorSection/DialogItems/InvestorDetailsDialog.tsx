import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogTitle,
} from '@radix-ui/react-dialog';
import { cn } from '@/lib/utils';
import { ChevronLeft, X } from 'lucide-react';
import { DialogHeader } from '@/components/ui/dialog';
import { FC, lazy, Suspense } from 'react';
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

  return (
    <Dialog
      open={investor ? Object.keys(investor).length > 0 : false}
      onOpenChange={open => {
        if (!open) setInvestor?.(null);
      }}
    >
      <DialogContent
        aria-describedby={undefined}
        // onInteractOutside={e => e.preventDefault()}
        className={cn(
          'fixed inset-0 z-50 p-10 mx-[20rem] my-[0rem] rounded-none shadow-none w-[calc(100vw-20rem)] h-screen max-w-none max-h-none bg-black'
        )}
      >
        <DialogHeader>
          <DialogTitle className="text-3xl text-white flex items-center justify-between">
            <div className="flex justify-center items-center gap-3">
              <DialogClose
                asChild
                className="border-[1px] border-[#383739] bg-[#242325] cursor-pointer"
              >
                <span className="p-1">
                  <ChevronLeft
                    className="text-3xl font-bold cursor-pointer hover:opacity-50"
                    onClick={() => setInvestor?.(null)}
                  />
                </span>
              </DialogClose>
              <span>Member Details</span>
            </div>
            <DialogClose
              asChild
              className="border-[1px] border-[#383739] bg-[#242325] cursor-pointer"
            >
              <span className="p-1">
                <X />
              </span>
            </DialogClose>
          </DialogTitle>
          <hr className="border-[#232A36] my-2" />
          <div className="flex justify-between w-full">
            <div className="flex gap-5">
              <div className="w-30 h-30 mr-2 mt-2 overflow-hidden">
                <img
                  src={profile_pic}
                  className="w-full h-full object-cover"
                  alt="dp"
                />
              </div>
              <div className="flex flex-col justify-around">
                <p className="text-3xl font-bold">{name}</p>
                <span className="border border-[#383739] text-white bg-zinc-400/20 text-center uppercase px-7">
                  {type} Investor
                </span>
                <p>Joined on: {joined_on}</p>
              </div>
            </div>
            <div className="flex gap-5 px-5 py-2">
              {deals_invested && (
                <div className="flex flex-col items-center">
                  <h2 className="text-5xl">{deals_invested}</h2>
                  <small className="text-muted">Deals Invested</small>
                </div>
              )}
              {deals_committed && (
                <div className="flex flex-col items-center">
                  <h2 className="text-5xl">{deals_committed}</h2>
                  <small className="text-muted">Deals Committed</small>
                </div>
              )}
              <div className="border-l border-[#383739] h-17"></div>
              <div className="flex flex-col items-center">
                <h2 className="text-5xl">{capital_commitment}</h2>
                <small className="text-muted">Capital Commited</small>
              </div>
            </div>
          </div>
        </DialogHeader>
        <Suspense fallback={<div>Loading...</div>}>
          <InvestorMainTab investor_id={investor_id ?? ''} />
        </Suspense>
      </DialogContent>
    </Dialog>
  );
};

export default InvestorDetailsDialog;

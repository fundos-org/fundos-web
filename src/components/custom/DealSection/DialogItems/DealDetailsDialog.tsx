import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogTitle,
} from '@radix-ui/react-dialog';
import { cn } from '@/lib/utils';
import { ChevronLeft, EyeOff, PenLine, X } from 'lucide-react';
import { DialogHeader } from '@/components/ui/dialog';
import { Dispatch, FC, SetStateAction, lazy, Suspense } from 'react';
import { DealCard, DealStatus } from '@/constants/dealsConstant';
import { convertToCrores } from '@/lib/currencyToWords';
import { Progress } from '@/components/ui/progress';
import DealStatusSelect from '../DealStatusSelect';
import { Button } from '@/components/ui/button';
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
  return (
    <Dialog
      open={details ? Object.keys(details).length > 0 : false}
      onOpenChange={open => {
        if (!open) setDetails?.(null);
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
                    onClick={() => setDetails?.(null)}
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
                  src={logo_url ?? ''}
                  className="w-full h-full object-cover"
                  alt="dp"
                />
              </div>
              <div className="flex flex-col justify-around">
                <p className="text-3xl font-bold">{title}</p>
                <div className="w-full flex gap-3">
                  <span className="border border-[#383739] text-white bg-zinc-400/20 text-center uppercase px-7">
                    {business_model}
                  </span>
                  <span className="border border-[#383739] text-white bg-zinc-400/20 text-center uppercase px-7">
                    {company_stage}
                  </span>
                </div>
                <p>Joined on: {created_at}</p>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <div className="flex gap-3 mr-5">
                <DealStatusSelect
                  deal_id={deal_id ?? ''}
                  initialStatus={deal_status as DealStatus}
                />
                <Button className="rounded-none px-10 border border-[#393738]">
                  <PenLine className="text-blue-500" /> Edit
                </Button>
                <Button className="rounded-none px-10 border border-[#393738]">
                  <EyeOff className="text-red-500" /> Mark Inactive
                </Button>
              </div>
              <div className="flex gap-5 px-5 py-2">
                <div className="flex flex-col items-start">
                  <small className="text-muted">Commitments</small>
                  <h2 className="text-5xl">
                    {convertToCrores(commitment ?? 0)}
                  </h2>
                </div>
                <div className="border-l border-[#383739] h-17"></div>
                <div className="flex flex-col items-start">
                  <small className="text-muted">Round Size</small>
                  <h2 className="text-5xl">
                    {convertToCrores(round_size ?? 0)}
                  </h2>
                </div>
              </div>
              <div className="w-97 ml-auto mr-5">
                <p className="text-sm text-zinc-400 mb-1">
                  {fund_raised_till_now ?? 0}% raised
                </p>
                <Progress
                  className="bg-black border border-zinc-600 w-full rounded-none h-[4px] [&>div]:bg-white"
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

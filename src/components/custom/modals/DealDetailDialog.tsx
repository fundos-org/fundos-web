import { Badge } from '@/components/ui/badge';
import {
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { DealCard } from '@/constants/dealsConstant';
import { convertToCrores } from '@/lib/currencyToWords';
import { X } from 'lucide-react';
import { FC } from 'react';

const DealDetailDialog: FC<{
  details: DealCard;
  displayIndustryType?: string;
  displayCompanyStage?: string;
}> = ({ details, displayIndustryType, displayCompanyStage }) => {
  const {
    deal_status,
    created_at,
    title,
    description,
    round_size,
    commitment,
    instruments,
    fund_raised_till_now,
    minimum_investment,
  } = details;
  return (
    <DialogContent
      className="max-w-[800px] h-[600px] rounded-none bg-[#1a1a1a] text-white border-0"
      hideCloseButton={true}
    >
      <DialogHeader>
        <DialogTitle className="text-3xl text-white flex items-center justify-between">
          Deal Details
          <DialogClose
            asChild
            className="border-[1px] border-[#383739] bg-[#242325]"
          >
            <span className="p-1">
              <X />
            </span>
          </DialogClose>
        </DialogTitle>
        <hr />
      </DialogHeader>
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          {/* <img src="./fundos.svg" alt="logo" width="50" /> : */}
          {/* <div className="bg-violet-200 text-violet-800 px-3 py-4 rounded-xs font-medium text-sm">
            🚀 Startup
          </div> */}
        </div>

        <div className="flex flex-col items-end">
          {deal_status === 'open' && (
            <Badge className="bg-[#00fb5745] text-white px-3 py-1 rounded-xs text-sm font-medium">
              <span className="mr-1 inline-block w-2 h-2 bg-green-400 rounded-full" />
              <span className="text-green-400">Active</span>
            </Badge>
          )}
          {deal_status === 'closed' && (
            <Badge className="bg-[#fd888845] text-white px-3 py-1 rounded-xs text-sm font-medium">
              <span className="mr-1 inline-block w-2 h-2 bg-red-400 rounded-full" />
              <span className="text-red-400">Closed</span>
            </Badge>
          )}
          {deal_status === 'on_hold' && (
            <Badge className="bg-[#fbbf2450] text-white px-3 py-1 rounded-xs text-sm font-medium">
              <span className="mr-1 inline-block w-2 h-2 bg-yellow-400 rounded-full" />
              <span className="text-yellow-400">On Hold</span>
            </Badge>
          )}
          <div className="flex gap-2 mt-3">
            <span className="bg-zinc-800 text-white px-3 py-1 rounded-xs text-sm">
              {displayIndustryType}
            </span>
            <span className="bg-zinc-800 text-white px-3 py-1 rounded-xs text-sm">
              {displayCompanyStage}
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-2">
            <span className="font-medium">Created on:</span>
            <span className="ml-1">
              {created_at ? created_at.split('T')[0] : 'N/A'}
            </span>
          </p>
        </div>
      </div>

      <h2 className="text-2xl font-bold">
        {title ? title : 'Default Deal Title'}
      </h2>
      <p className="text-zinc-400 mt-1">
        {description
          ? description
          : 'Default description for the deal. This is a placeholder text.'}
      </p>

      <hr />
      <div className="flex justify-between">
        <div>
          <p className="text-sm text-zinc-400">Funding round size</p>
          <p className="text-3xl font-bold">
            {round_size ? convertToCrores(round_size) : '0'}
          </p>
        </div>
        <div>
          <p className="text-sm text-zinc-400 text-right">Capital committed</p>
          <p className="text-3xl font-bold text-right">
            {commitment ? convertToCrores(commitment) : '0'}
          </p>
        </div>
      </div>
      <hr />
      <div className="flex justify-between">
        <div>
          <p className="text-sm text-zinc-400">Funding raised till now</p>
          <p className="text-3xl font-bold">
            {fund_raised_till_now ? convertToCrores(fund_raised_till_now) : '0'}
          </p>
        </div>
        <div>
          <p className="text-sm text-zinc-400 text-right">Minimum Investment</p>
          <p className="text-3xl font-bold text-right">
            {minimum_investment ? convertToCrores(minimum_investment) : '0'}
          </p>
        </div>
      </div>
      <hr />
      <div className="flex justify-between">
        <div>
          <p className="text-sm text-zinc-400">Instruments</p>
          <p className="text-3xl font-bold">
            {instruments ? instruments : '0'}
          </p>
        </div>
      </div>
    </DialogContent>
  );
};
export default DealDetailDialog;

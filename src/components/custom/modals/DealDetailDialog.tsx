import { Badge } from '@/components/ui/badge';
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { DealCard } from '@/constants/dealsConstant';
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
    fund_raised_till_now,
  } = details;
  return (
    <DialogContent className="max-w-[800px] h-[600px] rounded-none bg-[#1a1a1a] text-white border-0">
      <DialogHeader>
        <DialogTitle>Deal Details</DialogTitle>
        <DialogDescription>
          Deal details is under development. Please check back later.
        </DialogDescription>
      </DialogHeader>
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          {/* <img src="./fundos.svg" alt="logo" width="50" /> : */}
          <div className="bg-violet-200 text-violet-800 px-3 py-4 rounded-xs font-medium text-sm">
            🚀 Startup
          </div>
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
          <p className="text-xs text-zinc-400 mt-1">
            <span className="font-medium">Created on:</span>
            <span className="ml-1">
              {created_at ? created_at.split('T')[0] : 'N/A'}
            </span>
          </p>
        </div>
      </div>

      <h2 className="text-2xl font-bold mt-4">
        {title ? title : 'Default Deal Title'}
      </h2>
      <p className="text-zinc-400 mt-1">
        {description
          ? description
          : 'Default description for the deal. This is a placeholder text.'}
      </p>

      <div className="flex gap-2 mt-3">
        <span className="bg-zinc-800 text-white px-3 py-1 rounded-xs text-sm">
          {displayIndustryType}
        </span>
        <span className="bg-zinc-800 text-white px-3 py-1 rounded-xs text-sm">
          {displayCompanyStage}
        </span>
      </div>

      <div className="flex justify-between mt-6">
        <div>
          <p className="text-sm text-zinc-400">Funding round size</p>
          <p className="text-3xl font-bold">{round_size ? round_size : '0'}</p>
        </div>
        <div>
          <p className="text-sm text-zinc-400">Capital committed</p>
          <p className="text-3xl font-bold">{commitment ? commitment : '0'}</p>
        </div>
      </div>
      <div className="flex justify-between mt-6">
        <div>
          <p className="text-sm text-zinc-400">Funding raised till now</p>
          <p className="text-3xl font-bold">
            {fund_raised_till_now ? fund_raised_till_now : '0'}
          </p>
        </div>
        <div>
          <p className="text-sm text-zinc-400">Minimum Investment</p>
          {/* <p className="text-3xl font-bold">
              {dealDetails?.minimum_investment
                ? dealDetails?.minimum_investment
                : '0'}
            </p> */}
        </div>
      </div>
      <hr className="mt-3" />
      <div className="w-full mt-4 flex justify-between items-center">
        <div>
          <p className="text-sm text-zinc-400 mb-1">
            {fund_raised_till_now}% raised
          </p>
          <Progress
            className="bg-white border border-zinc-600 w-30 rounded-none"
            value={fund_raised_till_now}
          />
        </div>
      </div>
    </DialogContent>
  );
};
export default DealDetailDialog;

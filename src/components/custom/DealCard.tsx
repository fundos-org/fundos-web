import { Card, CardContent } from '@/components/ui/card';
import { ChevronDown } from 'lucide-react';
import { Progress } from '../ui/progress';
import { businessModels, DealCard, stages } from '@/constants/dealsConstant';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { useState } from 'react';
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from '../ui/menubar';
import toast from 'react-hot-toast';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Button } from '../ui/button';
type DealStatus = 'open' | 'closed' | 'on_hold';

function getStatusColor(status: DealStatus): string {
  switch (status) {
    case 'open':
      return 'bg-green-400';
    case 'closed':
      return 'bg-red-400';
    case 'on_hold':
      return 'bg-yellow-400';
    default:
      return 'bg-gray-400';
  }
}
function getStatusBgColor(status: DealStatus): string {
  switch (status) {
    case 'open':
      return 'bg-[#00fb5745]';
    case 'closed':
      return 'bg-[#fd888845]';
    case 'on_hold':
      return 'bg-[#fbbf2450]';
    default:
      return 'bg-[#6b728045]';
  }
}

function getIndustryType(industry: string | null): string {
  return (
    businessModels?.find(model => model.value === industry)?.name ||
    'Unknown Industry'
  );
}
function getCompanyStage(companyStage: string | null): string {
  return (
    stages?.find(model => model.value === companyStage)?.title ||
    'Unknown Stage'
  );
}

export default function CardDeal({ deal }: { deal: DealCard }) {
  const {
    title,
    deal_status,
    round_size,
    created_at,
    // logo_url,
    description,
    commitment,
    business_model,
    company_stage,
    fund_raised_till_now,
  } = deal;
  const [status, setStatus] = useState<DealStatus>(
    (deal_status as DealStatus) || 'open'
  );
  return (
    <Dialog>
      <Card className="border-0 rounded-none bg-[#1a1a1a] text-white p-5 w-[413px] max-w-md">
        <CardContent className="p-0">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              {/* <img src="./fundos.svg" alt="logo" width="50" /> : */}
              <div className="bg-violet-200 text-violet-800 px-3 py-4 rounded-xs font-medium text-sm">
                🚀 Startup
              </div>
            </div>

            <div className="flex flex-col items-end">
              <Select
                defaultValue={status}
                onValueChange={value => setStatus(value as DealStatus)}
              >
                <SelectTrigger
                  className={`rounded-none border-0 text-white ${getStatusBgColor(status)}`}
                >
                  <SelectValue>
                    <span
                      className={`mx-1 inline-block w-2 h-2 rounded-full ${getStatusColor(status)}`}
                    />
                    {status === 'open' ? 'Active' : null}
                    {status === 'closed' ? 'Closed' : null}
                    {status === 'on_hold' ? 'On Hold' : null}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a1a] text-white border rounded-none">
                  <SelectItem className="rounded-none" value="open">
                    Active
                  </SelectItem>
                  <SelectItem className="rounded-none" value="closed">
                    Closed
                  </SelectItem>
                  <SelectItem className="rounded-none" value="on_hold">
                    On Hold
                  </SelectItem>
                </SelectContent>
              </Select>
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
              {getIndustryType(business_model)}
            </span>
            <span className="bg-zinc-800 text-white px-3 py-1 rounded-xs text-sm">
              {getCompanyStage(company_stage)}
            </span>
          </div>

          <div className="flex justify-between mt-6">
            <div>
              <p className="text-sm text-zinc-400">Funding round size</p>
              <p className="text-3xl font-bold">
                {round_size ? round_size : '0'}
              </p>
            </div>
            <div>
              <p className="text-sm text-zinc-400">Capital committed</p>
              <p className="text-3xl font-bold">
                {commitment ? commitment : '0'}
              </p>
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
            <Menubar className="rounded-none bg-[#1a1a1a] border-0 text-white">
              <MenubarMenu>
                <MenubarTrigger className="rounded-none bg-[#1a1a1a] border-0 text-white font-medium cursor-pointer">
                  Manage <ChevronDown className="ml-1 h-5 w-5" />
                </MenubarTrigger>
                <MenubarContent className="bg-[#1a1a1a] text-white rounded-none">
                  <DialogTrigger asChild>
                    <MenubarItem className="rounded-none">
                      View Deal
                    </MenubarItem>
                  </DialogTrigger>
                  <MenubarSeparator />
                  <MenubarItem
                    onClick={() => toast.error('Edit Deal not implemented yet')}
                    className="rounded-none"
                  >
                    Edit Deal
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>
            </Menubar>
          </div>
        </CardContent>
      </Card>
      <DialogContent className="sm:max-w-[425px] rounded-none bg-[#1a1a1a] text-white border-0">
        <DialogHeader>
          <DialogTitle>Deal Details</DialogTitle>
          <DialogDescription>
            Deal details is under development. Please check back later.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose className="rounded-none bg-[#3a3a3a]" asChild>
            <Button
              variant="outline"
              className="text-slate-200 hover:bg-zinc-600 rounded-none border-0"
            >
              Okay
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

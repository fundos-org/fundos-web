import { Card, CardContent } from '@/components/ui/card';
import { ChevronDown, Eye, EyeOff, PenLine } from 'lucide-react';
import { Progress } from '../ui/progress';
import {
  businessModels,
  DealCard,
  DealStatus,
  stages,
} from '@/constants/dealsConstant';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { lazy, Suspense, useState } from 'react';
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from '../ui/menubar';
import toast from 'react-hot-toast';
import { Dialog, DialogTrigger } from '../ui/dialog';
import { changeDealStatus, fetchAllDeals } from '@/axioscalls/apiServices';
import { useAppDispatch } from '@/app/hooks';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';
import { convertToCrores } from '@/lib/currencyToWords';
import { useDealInactive } from '@/hooks/customhooks/DealsHooks/useDealInactive';
const DealDetailDialog = lazy(() => import('./modals/DealDetailDialog'));

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
  const [open, setOpen] = useState(false);
  const dispatch = useAppDispatch();
  const {
    deal_id,
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
  const { mutate: markInactive } = useDealInactive();
  const handleChangeStatus = async (e: DealStatus) => {
    console.log('Changing status to:', e, open);
    if (e !== 'closed' && !open) {
      const response = await changeDealStatus(deal_id, e);
      if (!response) {
        toast.error('Failed to change deal status');
        return;
      }
      if (response.message) {
        toast.success(response.message);
      }
      setStatus(e);
      dispatch(fetchAllDeals());
    } else if (e === 'closed' && !open) {
      setOpen(true);
    } else if (e === 'closed' && open) {
      const response = await changeDealStatus(deal_id, e);
      if (!response) {
        toast.error('Failed to change deal status');
        return;
      }
      if (response.message) {
        toast.success(response.message);
      }
      setStatus(e);
      setOpen(false);
      dispatch(fetchAllDeals());
    }
  };

  const handleClose = async () => {
    console.log(deal_status);
    setStatus(deal_status as DealStatus);
  };

  return (
    <Dialog>
      <Card className="border-0 rounded-none bg-[#1a1a1a] text-white p-5 w-[413px] max-w-md">
        {/* <DialogTrigger asChild> */}
        <CardContent className="p-0">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              {/* <img src="./fundos.svg" alt="logo" width="50" /> : */}
              {/* <div className="bg-violet-200 text-violet-800 px-3 py-4 rounded-xs font-medium text-sm">
                🚀 Startup
              </div> */}
            </div>

            <div className="flex flex-col items-end">
              <Select
                defaultValue={status}
                value={status}
                onValueChange={handleChangeStatus}
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
                {round_size ? convertToCrores(round_size) : '0'}
              </p>
            </div>
            <div>
              <p className="text-sm text-zinc-400">Capital committed</p>
              <p className="text-3xl font-bold">
                {commitment ? convertToCrores(commitment) : '0'}
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
                <MenubarContent className="bg-[#1a1a1a] text-white rounded-none border border-[#383739]">
                  <DialogTrigger asChild>
                    <MenubarItem className="rounded-none cursor-pointer">
                      <Eye /> View Deal
                    </MenubarItem>
                  </DialogTrigger>
                  <MenubarSeparator className="border-b border-[#383739]" />
                  <MenubarItem
                    onClick={() => toast.error('Edit Deal not implemented yet')}
                    className="rounded-none cursor-pointer"
                  >
                    <PenLine />
                    Edit Deal
                  </MenubarItem>
                  <MenubarSeparator className="border-b border-[#383739]" />
                  <MenubarItem
                    onClick={() => markInactive(deal.deal_id)}
                    className="rounded-none cursor-pointer"
                  >
                    <EyeOff className="text-red-500" />
                    <p className="text-red-500">Mark Inactive</p>
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>
            </Menubar>
          </div>
        </CardContent>
        {/* </DialogTrigger> */}
      </Card>
      <Suspense fallback={<div>Dialog Opening...</div>}>
        <DealDetailDialog
          details={deal}
          displayIndustryType={getIndustryType(business_model)}
          displayCompanyStage={getCompanyStage(company_stage)}
        />
      </Suspense>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent className="bg-gray-900 text-white border-gray-700 rounded-none">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl">
              Are you closing this deal?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-500">
              Closing the deal will mark it as closed and it cannot be
              reactivated.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={handleClose}
              className="bg-gray-800 px-10 text-white hover:bg-gray-700 border-gray-700 rounded-none"
            >
              Close
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 text-white hover:bg-red-700 rounded-none"
              onClick={() => handleChangeStatus('closed' as DealStatus)}
            >
              Close Deal
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
}

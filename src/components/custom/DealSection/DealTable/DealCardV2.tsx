import { Card, CardContent } from '@/components/ui/card';
import {
  // ChevronDown,
  Eye,
  EyeOff,
  PenLine,
  Settings,
  // SlidersHorizontal,
} from 'lucide-react';
import { Progress } from '../../../ui/progress';
import {
  businessModels,
  DealCard,
  DealStatus,
  stages,
} from '@/constants/dealsConstant';
import { lazy, Suspense } from 'react';
import { useState } from 'react';
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from '../../../ui/menubar';
import { useDealInactive } from '@/hooks/customhooks/DealsHooks/useDealInactive';
import { convertToCrores } from '@/lib/currencyToWords';
import DealStatusSelect from './DealStatusSelect'; // Added import for DealStatusSelect
const DealEditDialog = lazy(() => import('../DialogItems/DealEditDialog'));
const DealDetailsDialog = lazy(
  () => import('../DialogItems/DealDetailsDialog')
);

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
  const [show, setShow] = useState(false);
  const [details, setDetails] = useState<DealCard | null>(null);
  const [isRotated, setIsRotated] = useState(false);
  const {
    deal_id,
    title,
    deal_status,
    round_size,
    created_at,
    logo_url,
    description,
    commitment,
    business_model,
    company_stage,
    fund_raised_till_now,
  } = deal;
  const { mutate: markInactive } = useDealInactive();

  return (
    <>
      <Card className="border border-[#383739] rounded-none bg-gradient-to-b from-[#292929] via-[#202022] to-[#120d0d] text-white p-5 w-[350px] max-w-md">
        <CardContent className="p-0 flex flex-col gap-4">
          {/* <div> */}
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="">
                <div className="w-10 h-10 overflow-hidden">
                  <img
                    src={logo_url ?? ''}
                    className="w-full h-full object-cover"
                    alt="deal image"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end">
              <div className="flex gap-2">
                <Menubar className="rounded-none bg-transparent border-0 text-white">
                  <MenubarMenu>
                    <MenubarTrigger
                      className="rounded-none text-white hover:text-white focus:text-white data-[state=open]:text-white font-medium cursor-pointer bg-transparent border-0 p-0 h-auto hover:bg-transparent focus:bg-transparent data-[state=open]:bg-transparent"
                      onClick={() => setIsRotated(!isRotated)}
                    >
                      <Settings
                        className={`transition-transform duration-300 text-white ${
                          isRotated ? 'rotate-90' : 'rotate-0'
                        }`}
                      />
                    </MenubarTrigger>
                    <MenubarContent className="bg-[#1a1a1a] text-white rounded-none border border-[#383739]">
                      <MenubarItem
                        className="rounded-none cursor-pointer"
                        onClick={() => setDetails(deal)}
                      >
                        <Eye /> View Deal
                      </MenubarItem>
                      <MenubarSeparator className="border-b border-[#383739]" />
                      <MenubarItem
                        onClick={() => setShow(true)}
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
                <DealStatusSelect
                  deal_id={deal_id}
                  initialStatus={deal_status as DealStatus}
                />
              </div>
              <p className="text-xs text-zinc-400 mt-1">
                <span className="font-medium">Created on:</span>
                <span className="ml-1">
                  {created_at ? created_at.split('T')[0] : 'N/A'}
                </span>
              </p>
            </div>
          </div>
          <h2 className="text-2xl font-bold line-clamp-1">
            {title ? title : 'Default Deal Title'}
          </h2>
          <small className="text-zinc-400 mt-1 line-clamp-2">
            {description
              ? description
              : 'Default description for the deal. This is a placeholder text.'}
          </small>
          <div className="flex gap-2">
            <span className="bg-zinc-800 text-white px-3 py-1 rounded-xs text-sm">
              {getIndustryType(business_model)}
            </span>
            <span className="bg-zinc-800 text-white px-3 py-1 rounded-xs text-sm">
              {getCompanyStage(company_stage)}
            </span>
          </div>
          {/* </div>
          <div> */}
          <div className="flex justify-between">
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
          {/* <hr className="mt-3" /> */}
          <div className="w-full flex justify-between items-center">
            <div className="w-full">
              <p className="text-sm text-zinc-400 mb-1">
                {fund_raised_till_now ?? 0}% raised till now
              </p>
              <Progress
                className="bg-black border border-zinc-600 w-full rounded-none h-[4px] [&>div]:bg-white"
                value={fund_raised_till_now ?? 0}
              />
            </div>
          </div>
          {/* </div> */}
        </CardContent>
      </Card>
      <Suspense fallback={<div>Dialog Opening...</div>}>
        <DealEditDialog show={show} setShow={setShow} deal_id={deal_id} />
      </Suspense>
      <Suspense fallback={<div>Dialog Opening...</div>}>
        <DealDetailsDialog details={details} setDetails={setDetails} />
      </Suspense>
    </>
  );
}

import { Card, CardContent } from '@/components/ui/card';
import { ChevronDown, Eye, EyeOff, PenLine } from 'lucide-react';
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
import { useAwsFileObjectKey } from '@/hooks/useAwsFileObjectKey';
import { AWS_BUCKET_NAME } from '@/constants/enums';
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
  const [dealId, setDealId] = useState<string | null>(null);
  const [details, setDetails] = useState<DealCard | null>(null);
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
  const { data: logo } = useAwsFileObjectKey(AWS_BUCKET_NAME, logo_url ?? '');
  const { mutate: markInactive } = useDealInactive();

  return (
    <>
      <Card className="fundos-card-elevated border-gray-200 bg-white text-gray-900 p-4 w-full max-w-sm hover:shadow-lg transition-shadow duration-200">
        <CardContent className="p-0 flex flex-col justify-between cursor-pointer">
          <div className="cursor-pointer" onClick={() => setDetails(deal)}>
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 overflow-hidden flex items-center justify-center bg-gray-100 rounded-lg">
                  {logo && (
                    <img
                      src={logo}
                      className="max-w-full max-h-full object-contain"
                      alt="deal image"
                    />
                  )}
                </div>
              </div>

              <div className="flex flex-col items-end">
                <DealStatusSelect
                  deal_id={deal_id}
                  initialStatus={deal_status as DealStatus}
                />
                <p className="text-xs text-gray-500 mt-1">
                  <span className="font-medium">Created on:</span>
                  <span className="ml-1">
                    {created_at ? created_at.split('T')[0] : 'N/A'}
                  </span>
                </p>
              </div>
            </div>
            <h2 className="text-xl font-bold mt-3 line-clamp-1 hover:underline hover:text-blue-600 transition-colors">
              {title ? title : 'Default Deal Title'}
            </h2>
            <small className="text-gray-600 mt-1 line-clamp-2 text-sm">
              {description
                ? description
                : 'Default description for the deal. This is a placeholder text.'}
            </small>
            <div className="flex gap-2 mt-2">
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                {getIndustryType(business_model)}
              </span>
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                {getCompanyStage(company_stage)}
              </span>
            </div>
          </div>
          <div>
            <div className="flex justify-between mt-4">
              <div>
                <p className="text-sm text-gray-500 font-medium">Funding round size</p>
                <p className="text-2xl font-bold text-gray-900">
                  {round_size ? convertToCrores(round_size) : '0'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Capital committed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {commitment ? convertToCrores(commitment) : '0'}
                </p>
              </div>
            </div>
            <hr className="mt-2 border-gray-200" />
            <div className="w-full mt-3 flex justify-between items-center">
              <div className="flex-1 mr-4">
                <p className="text-sm text-gray-500 mb-2">
                  {fund_raised_till_now ?? 0}% raised
                </p>
                <Progress
                  className="bg-gray-200 w-full rounded-full h-2 [&>div]:bg-blue-600"
                  value={fund_raised_till_now ?? 0}
                />
              </div>
              <Menubar className="bg-white border border-gray-200 rounded-full overflow-hidden">
                <MenubarMenu>
                  <MenubarTrigger className="bg-white border-0 text-gray-700 font-medium cursor-pointer hover:bg-gray-50 rounded-full px-4 py-2 transition-colors">
                    Manage <ChevronDown className="ml-1 h-4 w-4" />
                  </MenubarTrigger>
                  <MenubarContent className="bg-white text-gray-900 rounded-lg border border-gray-200 shadow-lg">
                    <MenubarItem
                      className="cursor-pointer hover:bg-gray-50 rounded-md px-3 py-2 flex items-center gap-2"
                      onClick={() => setDetails(deal)}
                    >
                      <Eye className="w-4 h-4" /> View Deal
                    </MenubarItem>
                    <MenubarSeparator className="border-gray-200" />
                    <MenubarItem
                      onClick={() => setDealId(deal_id)}
                      className="cursor-pointer hover:bg-gray-50 rounded-md px-3 py-2 flex items-center gap-2"
                    >
                      <PenLine className="w-4 h-4" />
                      Edit Deal
                    </MenubarItem>
                    <MenubarSeparator className="border-gray-200" />
                    <MenubarItem
                      onClick={() => markInactive(deal.deal_id)}
                      className="cursor-pointer hover:bg-red-50 rounded-md px-3 py-2 flex items-center gap-2"
                    >
                      <EyeOff className="w-4 h-4 text-red-500" />
                      <span className="text-red-500">Mark Inactive</span>
                    </MenubarItem>
                  </MenubarContent>
                </MenubarMenu>
              </Menubar>
            </div>
          </div>
        </CardContent>
      </Card>
      {dealId !== null && (
        <Suspense fallback={<div></div>}>
          <DealEditDialog dealId={dealId} setDealId={setDealId} />
        </Suspense>
      )}
      {details !== null && (
        <Suspense fallback={<div></div>}>
          <DealDetailsDialog details={details} setDetails={setDetails} />
        </Suspense>
      )}
    </>
  );
}

import { Card, CardContent } from '@/components/ui/card';
import { businessModels, DealStatus, stages } from '@/constants/dealsConstant';
import { convertToCrores } from '@/lib/currencyToWords';
import { InvestedDeal } from '@/constants/membersConstant';

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
      return 'bg-[#fd888870]';
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

export default function CardDeal({ deal }: { deal: InvestedDeal }) {
  const {
    about_company,
    company_name,
    status,
    company_stage,
    created_at,
    deal_capital_commitment,
    equity,
    industry,
    logo_url,
    term_sheet,
  } = deal;
  console.log(term_sheet);

  return (
    <Card className="border-0 rounded-none bg-gradient-to-b from-[#383739] via-[#242325] to-[#242325] text-white p-5 w-[380px] max-w-md">
      <CardContent className="p-0 h-full flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            {logo_url ? (
              <div className="w-20 h-20 mr-2 mt-2 overflow-hidden">
                <img src={logo_url} alt="logo" width="50" height="50" />
              </div>
            ) : (
              <div className="bg-violet-200 text-violet-800 px-3 py-4 rounded-xs font-medium text-sm">
                🚀 Startup
              </div>
            )}
          </div>

          <div className="flex flex-col items-end">
            <div
              className={`rounded-none border-0 text-white ${getStatusBgColor(status)} border-[#33738] border px-5 py-1`}
            >
              <span
                className={`mr-3 inline-block w-2 h-2 rounded-full ${getStatusColor(status)}`}
              />
              {status === 'open' ? 'Active' : null}
              {status === 'closed' ? 'Closed' : null}
              {status === 'on_hold' ? 'On Hold' : null}
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-bold mt-4 line-clamp-1">
              {company_name ? company_name : 'Default Deal Title'}
            </h2>
            <p className="text-zinc-400 mt-1 line-clamp-2">
              {about_company
                ? about_company
                : 'Default description for the deal. This is a placeholder text.'}
            </p>

            <div className="flex gap-2 mt-3">
              <span className="bg-zinc-800 text-white px-3 py-1 text-sm border border-[#a1a1a140]">
                {getIndustryType(industry)}
              </span>
              <span className="bg-zinc-800 text-white px-3 py-1 text-sm border border-[#a1a1a140]">
                {getCompanyStage(company_stage)}
              </span>
            </div>
          </div>
        </div>
        <div>
          <div className="flex justify-between mt-6">
            <div>
              <p className="text-sm text-zinc-400">Equity</p>
              <p className="text-3xl font-bold">{equity ? equity : '0'}</p>
            </div>
            <div>
              <p className="text-sm text-zinc-400">Capital committed</p>
              <p className="text-3xl font-bold">
                {deal_capital_commitment
                  ? convertToCrores(deal_capital_commitment)
                  : '0'}
              </p>
            </div>
          </div>
          <hr className="mt-3" />
          <div className="w-full mt-4 flex justify-between items-center">
            <div className="flex flex-col">
              <p className="text-sm text-zinc-400 mb-1 underline">
                Invested on
              </p>
              <p className="text-sm text-zinc-400 mb-1 underline">
                {created_at}
              </p>
            </div>
            <div>
              <p className="text-sm text-zinc-400 mb-1 underline">
                View term sheet
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

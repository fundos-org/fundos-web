import { Card, CardContent } from '@/components/ui/card';
import { businessModels, DealStatus, stages } from '@/constants/dealsConstant';
import { convertToCrores } from '@/lib/currencyToWords';
import { InvestedDeal } from '@/constants/membersConstant';

function getStatusColor(status: DealStatus): string {
  switch (status) {
    case 'OPEN':
      return 'bg-green-600';
    case 'CLOSED':
      return 'bg-red-600';
    case 'ON_HOLD':
      return 'bg-yellow-600';
    default:
      return 'bg-gray-600';
  }
}
function getStatusBgColor(status: DealStatus): string {
  switch (status) {
    case 'OPEN':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'CLOSED':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'ON_HOLD':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}

function getIndustryType(industry: string | null): string {
  return (
    businessModels?.find(model => model.value === industry)?.name ||
    industry ||
    'Unknown Industry'
  );
}

function getCompanyStage(companyStage: string | null): string {
  return (
    stages?.find(model => model.value === companyStage)?.title ||
    companyStage ||
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
    <Card className="bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow p-6 h-full">
      <CardContent className="p-0 h-full flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 overflow-hidden flex items-center justify-center bg-gray-100 rounded-lg">
              {logo_url && (
                <img 
                  src={logo_url} 
                  alt="company logo" 
                  className="max-w-full max-h-full object-contain"
                />
              )}
            </div>
          </div>

          <div className="flex flex-col items-end">
            <div className={`rounded-full border px-3 py-1 text-xs font-medium ${getStatusBgColor(status)}`}>
              <span className={`mr-2 inline-block w-2 h-2 rounded-full ${getStatusColor(status)}`} />
              {status.toLowerCase() === 'open' ? 'Active' : null}
              {status.toLowerCase() === 'closed' ? 'Closed' : null}
              {status.toLowerCase() === 'on_hold' ? 'On Hold' : null}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              <span className="font-medium">Created on:</span>
              <span className="ml-1">
                {created_at ? created_at.split('T')[0] : 'N/A'}
              </span>
            </p>
          </div>
        </div>

        <div className="flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-bold mt-4 line-clamp-1 hover:underline hover:text-blue-600 transition-colors text-gray-900">
              {company_name ? company_name : 'Default Deal Title'}
            </h2>
            <p className="text-gray-600 mt-1 line-clamp-2 text-sm">
              {about_company
                ? about_company
                : 'Default description for the deal. This is a placeholder text.'}
            </p>

            <div className="flex gap-2 mt-3 flex-wrap">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                {getIndustryType(industry)}
              </span>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                {getCompanyStage(company_stage)}
              </span>
            </div>
          </div>
        </div>
        <div>
          <div className="flex justify-between mt-6">
            <div>
              <p className="text-sm text-gray-500 font-medium">Equity</p>
              <p className="text-2xl font-bold text-gray-900">{equity ? equity : '0'}%</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Capital committed</p>
              <p className="text-2xl font-bold text-gray-900">
                {deal_capital_commitment
                  ? convertToCrores(deal_capital_commitment)
                  : '0'}
              </p>
            </div>
          </div>
          <hr className="mt-3 border-gray-200" />
          <div className="w-full mt-4 flex justify-between items-center">
            <div className="flex flex-col">
              <p className="text-sm text-gray-500 mb-1">
                Invested on
              </p>
              <p className="text-sm text-gray-700 font-medium">
                {created_at ? created_at.split('T')[0] : 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm text-blue-600 hover:text-blue-700 cursor-pointer hover:underline">
                View term sheet
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

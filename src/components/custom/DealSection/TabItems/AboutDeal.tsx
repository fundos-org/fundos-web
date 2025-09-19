import { FC } from 'react';
// import { CheckCircle } from 'lucide-react';
import { useDealDetails } from '@/hooks/customhooks/DealsHooks/useDealDetails';

const AboutDeal: FC<{ deal_id: string }> = ({ deal_id }) => {
  const { data: details } = useDealDetails(deal_id);

  if (!details) return <div>No Details found.</div>;

  return (
    <div className="w-full text-gray-900 space-y-6 overflow-y-auto max-h-[60vh] p-6">
      <div className="space-y-6">
        {/* Deal Details Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900">Company Details</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Company Name */}
            <div className="space-y-3">
              <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                COMPANY NAME
              </label>
              <div className="bg-gray-50 border border-gray-200 text-gray-900 px-4 py-3 rounded-lg">
                {details.deal_details.company_name}
              </div>
            </div>
          </div>

          {/* About Company */}
          <div className="space-y-3">
            <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
              ABOUT COMPANY
            </label>
            <div className="bg-gray-50 border border-gray-200 text-gray-900 px-4 py-3 rounded-lg min-h-[80px]">
              <span>{details.deal_details.about_company}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                BUSINESS MODEL
              </label>
              <div className="bg-gray-50 border border-gray-200 text-gray-900 px-4 py-3 rounded-lg">
                {details.deal_details.business_model ?? 'N/A'}
              </div>
            </div>

            {/* Industry */}
            <div className="space-y-3">
              <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                INDUSTRY
              </label>
              <div className="bg-gray-50 border border-gray-200 text-gray-900 px-4 py-3 rounded-lg">
                {details.deal_details.industry ?? 'N/A'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutDeal;

import { FC } from 'react';
import { CheckCircle } from 'lucide-react';
import { useDealDetails } from '@/hooks/customhooks/DealsHooks/useDealDetails';

const AboutDeal: FC<{ deal_id: string }> = ({ deal_id }) => {
  const { data: details } = useDealDetails(deal_id);

  if (!details) return <div>No Details found.</div>;

  return (
    <div className="w-full text-white space-y-6 overflow-y-auto h-[calc(100vh-30vh)] custom-scrollbar-table">
      <div className="min-h-screen p-6">
        <div className="mx-auto space-y-6">
          {/* Deal Details Section */}
          <div className="space-y-2">
            <h2 className="text-2xl">Company Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Company Name */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  COMPANY NAME
                </label>
                <div className="bg-[#38373980] border-[#383739] text-white px-4 py-2 border">
                  {details.deal_details.company_name}
                </div>
              </div>

              {/* Company Website */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  COMPANY WEBSITE
                </label>
                <div className="border bg-[#38373980] border-[#383739] text-white px-4 py-2 flex items-center justify-between">
                  <span>{details.deal_details.company_website}</span>
                  <div className="flex items-center gap-1 text-[#14ca74] text-xs font-medium">
                    <CheckCircle className="w-3 h-3" />
                    VERIFIED
                  </div>
                </div>
              </div>
            </div>
            {/* Company Email */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                ABOUT COMPANY
              </label>
              <div className="border bg-[#38373980] border-[#383739] text-white px-4 py-2 flex items-start justify-between h-20">
                <span>{details.deal_details.about_company}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  BUSINESS MODEL
                </label>
                <div className="border bg-[#38373980] border-[#383739] text-white px-4 py-2">
                  {details.deal_details.business_model ?? 'N/A'}
                </div>
              </div>

              {/* Industry */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  INDUSTRY
                </label>
                <div className="border bg-[#38373980] border-[#383739] text-white px-4 py-2">
                  {details.deal_details.industry ?? 'N/A'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutDeal;

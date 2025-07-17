import { FC, useEffect, useState } from 'react';
import { useInvestorDetails } from '@/hooks/customhooks/MembersHooks/useInvestorDetails';
import { InvestorDetailsResponse } from '@/constants/membersConstant';
import { CheckCircle } from 'lucide-react';

const AboutInvestor: FC<{ investor_id: string }> = ({ investor_id }) => {
  const { data } = useInvestorDetails(investor_id);
  const [details, setDetails] = useState<InvestorDetailsResponse | null>(null);

  useEffect(() => {
    if (data) {
      setDetails(data);
    }
  }, [data]);

  if (!details) return <div>No Details found.</div>;

  return (
    <div className="w-full text-white space-y-6 overflow-y-auto h-[calc(100vh-30vh)] custom-scrollbar-table">
      <div className="min-h-screen p-6">
        <div className=" mx-auto space-y-6">
          {/* Personal Details Section */}
          <div className="space-y-2">
            <h2 className="text-2xl">Personal Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First Name */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  FIRST NAME
                </label>
                <div className="border bg-[#38373980] border-[#383739] text-white px-4 py-2">
                  {details.personal_details.first_name}
                </div>
              </div>

              {/* Last Name */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  LAST NAME
                </label>
                <div className="border bg-[#38373980] border-[#383739] text-white px-4 py-2">
                  {details.personal_details.last_name}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Email */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  E-MAIL
                </label>
                <div className="border bg-[#38373980] border-[#383739] text-white px-4 py-2 flex items-center justify-between">
                  <span>{details.personal_details.email}</span>
                  <div className="flex items-center gap-1 text-[#14ca74] text-xs font-medium">
                    <CheckCircle className="w-3 h-3" />
                    VERIFIED
                  </div>
                </div>
              </div>

              {/* Contact */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  CONTACT
                </label>
                <div className="border bg-[#38373980] border-[#383739] text-white px-4 py-2 flex items-center justify-between">
                  <span>{details.personal_details.phone_number}</span>
                  <div className="flex items-center gap-1 text-[#14ca74] text-xs font-medium">
                    <CheckCircle className="w-3 h-3" />
                    VERIFIED
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* PAN Number */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  PAN NUMBER
                </label>
                <div className="border bg-[#38373980] border-[#383739] text-white px-4 py-2 flex items-center justify-between">
                  <span>{details.personal_details.pan_number ?? 'N/A'}</span>
                  <div className="flex items-center gap-1 text-[#14ca74] text-xs font-medium">
                    <CheckCircle className="w-3 h-3" />
                    VERIFIED
                  </div>
                </div>
              </div>

              {/* Aadhar Number */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  AADHAR NUMBER
                </label>
                <div className="border bg-[#38373980] border-[#383739] text-white px-4 py-2 flex items-center justify-between">
                  <span>
                    {details.personal_details.aadhaar_number ?? 'N/A'}
                  </span>
                  <div className="flex items-center gap-1 text-[#14ca74] text-xs font-medium">
                    <CheckCircle className="w-3 h-3" />
                    VERIFIED
                  </div>
                </div>
              </div>
            </div>
          </div>
          <hr className="border-r border-[#383739]" />
          {/* Bank Details Section */}
          <div className="space-y-2">
            <h2 className="text-2xl">Bank Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Bank Account */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  BANK ACCOUNT
                </label>
                <div className="border bg-[#38373980] border-[#383739] text-white px-4 py-2">
                  {details.bank_details.bank_account_number ?? 'N/A'}
                </div>
              </div>

              {/* IFSC Code */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  IFSC CODE
                </label>
                <div className="border bg-[#38373980] border-[#383739] text-white px-4 py-2">
                  {details.bank_details.bank_ifsc ?? 'N/A'}
                </div>
              </div>
            </div>

            {/* Account Holder's Name */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                ACCOUNT HOLDER'S NAME
              </label>
              <div className="border bg-[#38373980] border-[#383739] text-white px-4 py-2 max-w-md">
                {details.bank_details.account_holder_name}
              </div>
            </div>
          </div>
          <hr className="border-r border-[#383739]" />
          {/* Professional Background Section */}
          <div className="space-y-2">
            <h2 className="text-2xl">Professional Background</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Occupation */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  OCCUPATION
                </label>
                <div className="border bg-[#38373980] border-[#383739] text-white px-4 py-2">
                  {details.professional_background.occupation}
                </div>
              </div>

              {/* Income Source */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  INCOME SOURCE
                </label>
                <div className="border bg-[#38373980] border-[#383739] text-white px-4 py-2">
                  {details.professional_background.income_source}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Annual Income */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  ANNUAL INCOME (IN Rs.)
                </label>
                <div className="border bg-[#38373980] border-[#383739] text-white px-4 py-2">
                  {details.professional_background.annual_income}
                </div>
              </div>

              {/* Capital Commitment */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  CAPITAL COMMITMENT (OVER 5 YEARS)
                </label>
                <div className="border bg-[#38373980] border-[#383739] text-white px-4 py-2">
                  {details.professional_background.capital_commitment}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutInvestor;

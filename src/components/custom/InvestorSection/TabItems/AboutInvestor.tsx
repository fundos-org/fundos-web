// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
import { FC, useEffect, useState } from 'react';
import { useInvestorDetails } from '@/hooks/customhooks/MembersHooks/useInvestorDetails';
import { InvestorDetailsResponse } from '@/constants/membersConstant';
// import { Input } from '@/components/ui/input';
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
    <div className="w-full text-white space-y-6 overflow-y-auto h-[calc(100vh-30vh)]">
      <div className="min-h-screen p-6">
        <div className=" mx-auto space-y-12">
          {/* Personal Details Section */}
          <div className="space-y-2">
            <h2 className="text-2xl">Personal Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First Name */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  FIRST NAME
                </label>
                <div className="bg-[#383739] text-white px-4 py-2">
                  Pratyush
                </div>
              </div>

              {/* Last Name */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  LAST NAME
                </label>
                <div className="bg-[#383739] text-white px-4 py-2">
                  Mahapatra
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Email */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  E-MAIL
                </label>
                <div className="bg-[#383739] text-white px-4 py-2 flex items-center justify-between">
                  <span>mahapatra.pratyush2@gmail.com</span>
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
                <div className="bg-[#383739] text-white px-4 py-2 flex items-center justify-between">
                  <span>+91 9776888194</span>
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
                <div className="bg-[#383739] text-white px-4 py-2 flex items-center justify-between">
                  <span>1802ERUI23</span>
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
                <div className="bg-[#383739] text-white px-4 py-2 flex items-center justify-between">
                  <span>1209 8988 3456</span>
                  <div className="flex items-center gap-1 text-[#14ca74] text-xs font-medium">
                    <CheckCircle className="w-3 h-3" />
                    VERIFIED
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bank Details Section */}
          <div className="space-y-2">
            <h2 className="text-2xl">Bank Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Bank Account */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  BANK ACCOUNT
                </label>
                <div className="bg-[#383739] text-white px-4 py-2">
                  012345678910
                </div>
              </div>

              {/* IFSC Code */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  IFSC CODE
                </label>
                <div className="bg-[#383739] text-white px-4 py-2">
                  KKBK20078
                </div>
              </div>
            </div>

            {/* Account Holder's Name */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                ACCOUNT HOLDER'S NAME
              </label>
              <div className="bg-[#383739] text-white px-4 py-2 max-w-md">
                Pratyush Kumar mahapatra
              </div>
            </div>
          </div>

          {/* Professional Background Section */}
          <div className="space-y-2">
            <h2 className="text-2xl">Professional Background</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Occupation */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  OCCUPATION
                </label>
                <div className="bg-[#383739] text-white px-4 py-2">
                  Investor
                </div>
              </div>

              {/* Income Source */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  INCOME SOURCE
                </label>
                <div className="bg-[#383739] text-white px-4 py-2">
                  Business
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Annual Income */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  ANNUAL INCOME (IN Rs.)
                </label>
                <div className="bg-[#383739] text-white px-4 py-2">
                  1Cr - 5Cr
                </div>
              </div>

              {/* Capital Commitment */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  CAPITAL COMMITMENT (OVER 5 YEARS)
                </label>
                <div className="bg-[#383739] text-white px-4 py-2">
                  ₹50,00,000
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

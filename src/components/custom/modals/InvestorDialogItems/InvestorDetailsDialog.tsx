import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { X } from 'lucide-react';
import { Dispatch, SetStateAction, useState } from 'react';
import PersonalDetails from './PersonalDetails';
import { useInvestorDetails } from '@/hooks/customhooks/MembersHooks/useInvestorDetails';
import { InvestorDetailsResponse } from '@/constants/membersConstant';
import BankDetails from './BankDetails';
import ProfessionalBackground from './ProfessionalBackground';

export default function InvestorDetailsDialog({
  isDialogOpen,
  setDialogOpen,
  investor_id,
}: {
  isDialogOpen: boolean;
  setDialogOpen: Dispatch<SetStateAction<boolean>>;
  investor_id: string;
}) {
  const [activeTab, setActiveTab] = useState<LocalEnum>(LocalEnum.PD);
  const { data: investorDetails, error } = useInvestorDetails(investor_id);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent
        hideCloseButton={true}
        className="border-0 rounded-none bg-[#181C23] text-white sm:max-w-4xl max-h-[90vh]"
        aria-describedby={undefined}
        onInteractOutside={e => e.preventDefault()}
      >
        {!error ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-3xl text-white flex items-center justify-between">
                Edit Member
                <DialogClose
                  asChild
                  className="border-[1px] border-[#383739] bg-[#242325] cursor-pointer"
                >
                  <span className="p-1">
                    <X />
                  </span>
                </DialogClose>
              </DialogTitle>
              <hr className="border-[#232A36] my-2" />
            </DialogHeader>
            <div className="w-full flex">
              <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
              <div className="border-r border-gray-800"></div>
              <Content
                activeTab={activeTab}
                investorDetails={investorDetails as InvestorDetailsResponse}
                setDialogOpen={setDialogOpen}
              />
            </div>
          </>
        ) : (
          <div>Some Error occured</div>
        )}
      </DialogContent>
    </Dialog>
  );
}

interface Tab {
  id: number;
  label: LocalEnum;
}

// Sidebar component
const Sidebar: React.FC<{
  activeTab: string;
  setActiveTab: (tab: LocalEnum) => void;
}> = ({ activeTab, setActiveTab }) => {
  const tabs: Tab[] = [
    { id: 1, label: LocalEnum.PD },
    { id: 2, label: LocalEnum.BD },
    { id: 3, label: LocalEnum.PB },
  ];

  return (
    <div className="w-64 h-[50vh] p-4">
      {tabs.map(tab => (
        <button
          key={tab.id}
          className={`w-full text-left py-2 px-4 mb-2 text-md font-medium ${
            activeTab === tab.label
              ? 'bg-[#313132] text-white'
              : ' text-gray-400 hover:bg-[#313132]'
          }`}
          onClick={() => setActiveTab(tab.label)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

// Main content component
const Content: React.FC<{
  activeTab: LocalEnum;
  investorDetails: InvestorDetailsResponse;
  setDialogOpen: Dispatch<SetStateAction<boolean>>;
}> = ({ activeTab, investorDetails, setDialogOpen }) => {
  return (
    <div className="flex-1">
      {activeTab === LocalEnum.PD && (
        <PersonalDetails
          details={investorDetails.personal_details}
          setDialogOpen={setDialogOpen}
        />
      )}
      {activeTab === LocalEnum.BD && (
        <BankDetails
          details={investorDetails.bank_details}
          setDialogOpen={setDialogOpen}
        />
      )}
      {activeTab === LocalEnum.PB && (
        <ProfessionalBackground
          details={investorDetails.professional_background}
          setDialogOpen={setDialogOpen}
        />
      )}
    </div>
  );
};

const enum LocalEnum {
  PB = 'Professional Background',
  BD = 'Bank Details',
  PD = 'Personal Details',
}

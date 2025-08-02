import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { lazy, Suspense } from 'react';
import { X } from 'lucide-react';
import { Dispatch, SetStateAction, useState } from 'react';
import { useInvestorDetails } from '@/hooks/customhooks/MembersHooks/useInvestorDetails';
import {
  InvestorDetailsResponse,
  UpdateInvestorRequest,
} from '@/constants/membersConstant';
import { useInvestorEditDetails } from '@/hooks/customhooks/MembersHooks/useInvestorEditDetails';
const PersonalDetails = lazy(() => import('../EditableItems/PersonalDetails'));
const BankDetails = lazy(() => import('../EditableItems/BankDetails'));
const ProfessionalBackground = lazy(
  () => import('../EditableItems/ProfessionalBackground')
);

interface OpenEditDialog {
  investor_id: string;
  subadmin_id?: string;
}

export default function InvestorEditDialog({
  editDetailsOpen,
  setEditDetailsOpen,
}: {
  editDetailsOpen: OpenEditDialog | null;
  setEditDetailsOpen: Dispatch<SetStateAction<OpenEditDialog | null>>;
}) {
  const [activeTab, setActiveTab] = useState<LocalEnum>(LocalEnum.PD);
  const { data: investorDetails, error } = useInvestorDetails(
    editDetailsOpen?.investor_id
  );
  const { mutate: updateInvestorDetails } =
    useInvestorEditDetails(editDetailsOpen);

  const handleUpdateDetails = (details: Partial<UpdateInvestorRequest>) =>
    updateInvestorDetails(details);

  return (
    <Dialog
      open={
        editDetailsOpen !== null && Object.keys(editDetailsOpen).length === 2
      }
      onOpenChange={open => {
        if (!open) setEditDetailsOpen(null);
      }}
    >
      <DialogContent
        hideCloseButton={true}
        className="border-0 rounded-none bg-[#181C23] text-white sm:max-w-4xl max-h-[90vh]"
        aria-describedby={undefined}
        onInteractOutside={e => e.preventDefault()}
      >
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
        {!error ? (
          <>
            <div className="w-full flex">
              <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
              <div className="border-r border-gray-800"></div>
              <Content
                activeTab={activeTab}
                investorDetails={investorDetails as InvestorDetailsResponse}
                setDialogOpen={() => setEditDetailsOpen(null)}
                handleUpdateDetails={handleUpdateDetails}
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
  handleUpdateDetails: (value: UpdateInvestorRequest) => void;
}> = ({ activeTab, investorDetails, setDialogOpen, handleUpdateDetails }) => {
  return (
    <div className="flex-1">
      {activeTab === LocalEnum.PD && (
        <Suspense fallback={<div>Loading...</div>}>
          <PersonalDetails
            details={investorDetails?.personal_details}
            setDialogOpen={setDialogOpen}
            handleUpdateDetails={handleUpdateDetails}
          />
        </Suspense>
      )}
      {activeTab === LocalEnum.BD && (
        <Suspense fallback={<div>Loading...</div>}>
          <BankDetails
            details={investorDetails?.bank_details}
            setDialogOpen={setDialogOpen}
          />
        </Suspense>
      )}
      {activeTab === LocalEnum.PB && (
        <Suspense fallback={<div>Loading...</div>}>
          <ProfessionalBackground
            details={investorDetails?.professional_background}
            setDialogOpen={setDialogOpen}
            handleUpdateDetails={handleUpdateDetails}
          />
        </Suspense>
      )}
    </div>
  );
};

const enum LocalEnum {
  PB = 'Professional Background',
  BD = 'Bank Details',
  PD = 'Personal Details',
}

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
        className="bg-white border border-gray-200 rounded-lg shadow-xl sm:max-w-4xl max-h-[90vh] p-0 overflow-hidden"
        aria-describedby={undefined}
        onInteractOutside={e => e.preventDefault()}
      >
        <DialogHeader className="border-b border-gray-200 p-6">
          <DialogTitle className="text-2xl font-semibold text-gray-900 flex items-center justify-between">
            Edit Member
            <DialogClose
              asChild
              className="border border-gray-300 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer transition-colors"
            >
              <span className="p-2">
                <X className="w-5 h-5 text-gray-600" />
              </span>
            </DialogClose>
          </DialogTitle>
        </DialogHeader>
        {!error ? (
          <>
            <div className="w-full flex min-h-[60vh]">
              <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
              <div className="border-r border-gray-200"></div>
              <Content
                activeTab={activeTab}
                investorDetails={investorDetails as InvestorDetailsResponse}
                setDialogOpen={() => setEditDetailsOpen(null)}
                handleUpdateDetails={handleUpdateDetails}
              />
            </div>
          </>
        ) : (
          <div className="p-6 text-center text-red-600">Some Error occurred</div>
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
    <div className="w-64 bg-gray-50 p-4">
      {tabs.map(tab => (
        <button
          key={tab.id}
          className={`w-full text-left py-3 px-4 mb-2 text-sm font-medium rounded-lg transition-colors ${
            activeTab === tab.label
              ? 'bg-blue-600 text-white'
              : 'text-gray-700 hover:bg-gray-200'
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
    <div className="flex-1 p-6 bg-white overflow-y-auto">
      {activeTab === LocalEnum.PD && (
        <Suspense fallback={<div className="text-gray-500">Loading...</div>}>
          <PersonalDetails
            details={investorDetails?.personal_details}
            setDialogOpen={setDialogOpen}
            handleUpdateDetails={handleUpdateDetails}
          />
        </Suspense>
      )}
      {activeTab === LocalEnum.BD && (
        <Suspense fallback={<div className="text-gray-500">Loading...</div>}>
          <BankDetails
            details={investorDetails?.bank_details}
            setDialogOpen={setDialogOpen}
          />
        </Suspense>
      )}
      {activeTab === LocalEnum.PB && (
        <Suspense fallback={<div className="text-gray-500">Loading...</div>}>
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

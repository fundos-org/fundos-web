import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { DealDetails as DealDetailsInterface } from '@/constants/dealsConstant';
import { useDealDetails } from '@/hooks/customhooks/DealsHooks/useDealDetails';
import { useDealEditDetails } from '@/hooks/customhooks/DealsHooks/useDealEditDetails';
import { X } from 'lucide-react';
import { Dispatch, FC, SetStateAction, Suspense, useState } from 'react';
import CompanyDetails from '../EditableItems/CompanyDetails';
import MarketDetails from '../EditableItems/MarketDetails';
import DealDetails from '../EditableItems/DealDetails';
import { Files } from '@/axioscalls/apiServices';

interface Tab {
  id: number;
  label: LocalEnum;
}

const DealEditDialog: FC<{
  dealId: string | null;
  setDealId: Dispatch<SetStateAction<string | null>>;
}> = ({ dealId, setDealId }) => {
  const [activeTab, setActiveTab] = useState<LocalEnum>(LocalEnum.CD);
  const { data, error } = useDealDetails(dealId);
  const { mutate: updateDeal } = useDealEditDetails(dealId);

  // Wrapper to match the expected signature
  const handleUpdateDetails = (
    details: Partial<DealDetailsInterface>,
    files?: Partial<Files>
  ) => {
    // Pass files as part of details if needed, or handle as required by your API
    updateDeal({ ...details, ...(files ? { files } : {}) });
  };

  return (
    <Dialog
      open={dealId !== null && dealId !== undefined}
      onOpenChange={open => {
        if (!open) setDealId(null);
      }}
    >
      <DialogContent
        hideCloseButton={true}
        className="bg-white border border-gray-200 rounded-lg shadow-xl sm:max-w-4xl max-h-[90vh] p-0"
        aria-describedby={undefined}
        onInteractOutside={e => e.preventDefault()}
      >
        <>
          <DialogHeader className="border-b border-gray-200 p-6">
            <DialogTitle className="text-2xl font-semibold text-gray-900 flex items-center justify-between">
              Edit Deal
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
            <div className="flex h-[calc(90vh-120px)]">
              <div className="border-r border-gray-200 bg-gray-50">
                <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
              </div>
              <div className="flex-1">
                <Content
                  activeTab={activeTab}
                  dealDetails={data?.deal_details as DealDetailsInterface}
                  setDealId={setDealId}
                  handleUpdateDetails={handleUpdateDetails}
                />
              </div>
            </div>
          ) : (
            <div className="p-6 text-center text-red-600">Some Error occurred</div>
          )}
        </>
      </DialogContent>
    </Dialog>
  );
};

export default DealEditDialog;

// Sidebar component
const Sidebar: React.FC<{
  activeTab: string;
  setActiveTab: (tab: LocalEnum) => void;
}> = ({ activeTab, setActiveTab }) => {
  const tabs: Tab[] = [
    { id: 1, label: LocalEnum.CD },
    { id: 2, label: LocalEnum.MD },
    { id: 3, label: LocalEnum.DD },
  ];

  return (
    <div className="w-80 p-6">
      {tabs.map(tab => (
        <button
          key={tab.id}
          className={`w-full text-left py-3 px-4 mb-2 rounded-lg font-medium transition-colors ${
            activeTab === tab.label
              ? 'bg-blue-100 text-blue-800 border border-blue-300 shadow-sm'
              : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
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
const Content: FC<{
  activeTab: LocalEnum;
  dealDetails: DealDetailsInterface | undefined;
  setDealId: Dispatch<SetStateAction<string | null>>;
  handleUpdateDetails: (
    details: Partial<DealDetailsInterface>,
    files?: Partial<Files>
  ) => void;
}> = ({ activeTab, dealDetails, setDealId, handleUpdateDetails }) => {
  if (!dealDetails) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }
  return (
    <div className="flex-1 overflow-y-auto p-6">
      {activeTab === LocalEnum.CD && (
        <Suspense fallback={<div>Loading...</div>}>
          <CompanyDetails
            details={dealDetails}
            setDealId={setDealId}
            handleUpdateDetails={handleUpdateDetails}
          />
        </Suspense>
      )}
      {activeTab === LocalEnum.MD && (
        <Suspense fallback={<div>Loading...</div>}>
          <MarketDetails
            details={dealDetails}
            setDealId={setDealId}
            handleUpdateDetails={handleUpdateDetails}
          />
        </Suspense>
      )}
      {activeTab === LocalEnum.DD && (
        <Suspense fallback={<div>Loading...</div>}>
          <DealDetails
            details={dealDetails}
            setDealId={setDealId}
            handleUpdateDetails={handleUpdateDetails}
          />
        </Suspense>
      )}
    </div>
  );
};

const enum LocalEnum {
  CD = 'Company Details',
  MD = 'Market Details',
  DD = 'Deal Details',
}

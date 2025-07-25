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
  const { mutate: updateDealDetails } = useDealEditDetails(dealId);
  const handleUpdateDetails = (
    details: Partial<Partial<DealDetailsInterface>>
  ) => updateDealDetails(details);

  return (
    <Dialog
      open={dealId !== null && dealId !== undefined}
      onOpenChange={open => {
        if (!open) setDealId(null);
      }}
    >
      <DialogContent
        hideCloseButton={true}
        className="border-0 rounded-none bg-[#181C23] text-white sm:max-w-5xl max-h-[90vh]"
        aria-describedby={undefined}
        onInteractOutside={e => e.preventDefault()}
      >
        <>
          <DialogHeader>
            <DialogTitle className="text-3xl text-white flex items-center justify-between">
              Edit Deal
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
            <div className="w-full flex">
              <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
              <div className="border-r border-gray-800"></div>
              <Content
                activeTab={activeTab}
                dealDetails={data?.deal_details as DealDetailsInterface}
                setDealId={setDealId}
                handleUpdateDetails={handleUpdateDetails}
              />
            </div>
          ) : (
            <div>Some Error occured</div>
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
const Content: FC<{
  activeTab: LocalEnum;
  dealDetails: DealDetailsInterface;
  setDealId: Dispatch<SetStateAction<string | null>>;
  handleUpdateDetails: (value: Partial<DealDetailsInterface>) => void;
}> = ({ activeTab, dealDetails, setDealId, handleUpdateDetails }) => {
  return (
    <div className="flex-1">
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

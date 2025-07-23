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
import { useSubadminDetails } from '@/hooks/customhooks/SubAdminsHooks/useSubadminDetails';
import { SubadminDetailsResponse } from '@/constants/dealsConstant';
import { useSubadminEditDetails } from '@/hooks/customhooks/SubAdminsHooks/useSubadminEditDetails';
const ProfileDetails = lazy(() => import('../EditableItems/ProfileDetails'));
const LoginDetails = lazy(() => import('../EditableItems/LoginDetails'));

export default function SubAdminEditDialog({
  subadminId,
  setSubadminId,
}: {
  subadminId: string | null;
  setSubadminId: Dispatch<SetStateAction<string | null>>;
}) {
  const [activeTab, setActiveTab] = useState<LocalEnum>(LocalEnum.PD);

  return (
    <Dialog
      open={subadminId !== null && subadminId !== undefined}
      onOpenChange={open => {
        if (!open) setSubadminId(null);
      }}
    >
      <DialogContent
        hideCloseButton={true}
        className="border-0 rounded-none bg-[#181C23] text-white sm:max-w-4xl max-h-[90vh]"
        aria-describedby={undefined}
        onInteractOutside={e => e.preventDefault()}
      >
        <>
          <DialogHeader>
            <DialogTitle className="text-3xl text-white flex items-center justify-between">
              Edit Sub-Admin
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
              subadminId={subadminId || ''}
              setDialogOpen={() => setSubadminId(null)}
            />
          </div>
        </>
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
    { id: 2, label: LocalEnum.LD },
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
  subadminId: string;
  setDialogOpen: Dispatch<SetStateAction<string | null>>;
}> = ({ activeTab, subadminId, setDialogOpen }) => {
  const { data: subadminDetails, error } = useSubadminDetails(subadminId);
  const { mutate: updateSubAdmin } = useSubadminEditDetails(subadminId);
  return (
    <>
      {!error ? (
        <div className="flex-1">
          {activeTab === LocalEnum.PD && (
            <Suspense fallback={<div>Loading...</div>}>
              <ProfileDetails
                data={subadminDetails ?? {}}
                setDialogOpen={setDialogOpen}
                handleUpdateDetails={updateSubAdmin}
              />
            </Suspense>
          )}
          {activeTab === LocalEnum.LD && (
            <Suspense fallback={<div>Loading...</div>}>
              <LoginDetails
                data={subadminDetails as SubadminDetailsResponse}
                setDialogOpen={setDialogOpen}
                handleUpdateDetails={updateSubAdmin}
              />
            </Suspense>
          )}
        </div>
      ) : (
        <div>Not data Found</div>
      )}
    </>
  );
};

const enum LocalEnum {
  PD = 'Profile Details',
  LD = 'Login Details',
}

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
        className="bg-white border border-gray-200 rounded-lg shadow-xl sm:max-w-4xl max-h-[90vh] p-0"
        aria-describedby={undefined}
        onInteractOutside={e => e.preventDefault()}
      >
        <>
          <DialogHeader className="border-b border-gray-200 p-6">
            <DialogTitle className="text-2xl font-semibold text-gray-900 flex items-center justify-between">
              Edit Sub Admin
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
          <div className="flex h-[calc(90vh-120px)]">
            <div className="border-r border-gray-200 bg-gray-50">
              <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            </div>
            <div className="flex flex-col w-full">
              <Content
                activeTab={activeTab}
                subadminId={subadminId || ''}
                setDialogOpen={() => setSubadminId(null)}
              />
            </div>
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
    <div className="w-64 p-4">
      <div className="space-y-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`w-full text-left py-3 px-4 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.label
                ? 'bg-blue-100 text-blue-700 border border-blue-200'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
            onClick={() => setActiveTab(tab.label)}
          >
            {tab.label}
          </button>
        ))}
      </div>
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
        <div className="flex flex-col w-full h-full">
          <div className="overflow-y-auto flex-1 p-6">
            {activeTab === LocalEnum.PD && (
              <Suspense fallback={<div className="flex items-center justify-center h-32 text-gray-500">Loading...</div>}>
                <ProfileDetails
                  data={subadminDetails ?? {}}
                  setDialogOpen={setDialogOpen}
                  handleUpdateDetails={updateSubAdmin}
                />
              </Suspense>
            )}
            {activeTab === LocalEnum.LD && (
              <Suspense fallback={<div className="flex items-center justify-center h-32 text-gray-500">Loading...</div>}>
                <LoginDetails
                  data={subadminDetails as SubadminDetailsResponse}
                  setDialogOpen={setDialogOpen}
                  handleUpdateDetails={updateSubAdmin}
                />
              </Suspense>
            )}
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-full text-gray-500">
          No data found
        </div>
      )}
    </>
  );
};

const enum LocalEnum {
  PD = 'Profile Details',
  LD = 'Login Details',
}

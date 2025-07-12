import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { X } from 'lucide-react';
import { useState } from 'react';

export default function InvestorDetailsDialog({
  isDialogOpen,
  setDialogOpen,
}: {
  isDialogOpen: boolean;
  setDialogOpen: (value: boolean) => void;
}) {
  const [activeTab, setActiveTab] = useState<string>('test1');
  return (
    <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent
        hideCloseButton={true}
        className="border-0 rounded-none bg-[#181C23] text-white sm:max-w-6xl max-h-[90vh]"
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
        <div className="w-full flex">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          <div className="border-r border-gray-800"></div>
          <Content activeTab={activeTab} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface Tab {
  id: string;
  label: string;
}

// Test1 Component
const Test1: React.FC = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Test 1 Component</h2>
      <p className="text-gray-700">
        This is the Test 1 component. It contains sample content for the first
        tab. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
        eiusmod tempor incididunt ut labore et dolore magna aliqua.
      </p>
    </div>
  );
};

// Test2 Component
const Test2: React.FC = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Test 2 Component</h2>
      <p className="text-gray-700">
        This is the Test 2 component. It provides different content for the
        second tab. Ut enim ad minim veniam, quis nostrud exercitation ullamco
        laboris nisi ut aliquip ex ea commodo consequat.
      </p>
    </div>
  );
};

// Test3 Component
const Test3: React.FC = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Test 3 Component</h2>
      <p className="text-gray-700">
        This is the Test 3 component. It displays unique content for the third
        tab. Duis aute irure dolor in reprehenderit in voluptate velit esse
        cillum dolore eu fugiat nulla pariatur.
      </p>
    </div>
  );
};

// Sidebar component
const Sidebar: React.FC<{
  activeTab: string;
  setActiveTab: (tab: string) => void;
}> = ({ activeTab, setActiveTab }) => {
  const tabs: Tab[] = [
    { id: 'test1', label: 'Test 1' },
    { id: 'test2', label: 'Test 2' },
    { id: 'test3', label: 'Test 3' },
  ];

  return (
    <div className="w-64 h-[50vh] p-4">
      {tabs.map(tab => (
        <button
          key={tab.id}
          className={`w-full text-left py-2 px-4 mb-2 text-lg font-medium ${
            activeTab === tab.id
              ? 'bg-[#313132] text-white'
              : ' text-gray-400 hover:bg-[#313132]'
          }`}
          onClick={() => setActiveTab(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

// Main content component
const Content: React.FC<{ activeTab: string }> = ({ activeTab }) => {
  return (
    <div className="flex-1">
      {activeTab === 'test1' && <Test1 />}
      {activeTab === 'test2' && <Test2 />}
      {activeTab === 'test3' && <Test3 />}
    </div>
  );
};

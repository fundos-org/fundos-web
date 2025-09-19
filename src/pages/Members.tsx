import BulkOnboarding from '@/components/custom/BulkOnboardingSection/BulkOnboarding';
import AddMemberDialog from '@/components/custom/modals/AddMemberDialog';
import StatisticCardList from '@/components/custom/StatisticCardList';
import { DialogTrigger, Dialog } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useInvestorsMetadata } from '@/hooks/customhooks/MembersHooks/useInvestorsMetadata';
import isThisSubadmin from '@/lib/isSubadmin';
import { lazy, Suspense, useState } from 'react';
const InvestorTable = lazy(
  () =>
    import('@/components/custom/InvestorSection/InvestorTable/InvestorTable')
);

export default function Members() {
  const [isSubadmin] = useState<boolean>(isThisSubadmin);
  const { data: stats } = useInvestorsMetadata(isSubadmin);

  return (
    <Dialog>
      <header className="flex justify-between items-center mb-2">
        <div>
          <h1 className="fundos-dashboard-title">Members</h1>
          <p className="fundos-dashboard-subtitle">Track whom you are onboarding</p>
        </div>
        {isSubadmin && (
          <DialogTrigger asChild>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors">
              Add Member
            </button>
          </DialogTrigger>
        )}
      </header>
      <Tabs defaultValue="active" className="w-full mt-6">
        <TabsList className="w-full justify-start bg-white border-b border-gray-200 rounded-none h-auto p-0">
          <TabsTrigger
            value="active"
            className="cursor-pointer bg-transparent border-0 text-gray-600 font-medium hover:text-gray-900 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none px-6 py-3 transition-colors"
          >
            Investors
          </TabsTrigger>
          {isSubadmin && (
            <TabsTrigger
              value="closed"
              className="cursor-pointer bg-transparent border-0 text-gray-600 font-medium hover:text-gray-900 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none px-6 py-3 transition-colors"
            >
              Bulk Onboard
            </TabsTrigger>
          )}
        </TabsList>
        <TabsContent value="active" className="w-full mt-6">
          {isSubadmin && <StatisticCardList stats={stats?.metadata} />}
          <div className="mt-6">
            <Suspense fallback={<div>Loading...</div>}>
              <InvestorTable isSubadmin={isSubadmin} />
            </Suspense>
          </div>
        </TabsContent>
        <TabsContent value="closed" className="w-full mt-6">
          <BulkOnboarding />
        </TabsContent>
      </Tabs>
      <AddMemberDialog />
    </Dialog>
  );
}

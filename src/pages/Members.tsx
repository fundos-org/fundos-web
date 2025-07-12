import BulkOnboarding from '@/components/custom/BulkOnboarding';
import AddMemberDialog from '@/components/custom/modals/AddMemberDialog';
import StatisticCardList from '@/components/custom/StatisticCardList';
import { DialogTrigger, Dialog } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useInvestorsMetadata } from '@/hooks/customhooks/MembersHooks/useInvestorsMetadata';
import toast from 'react-hot-toast';
import { lazy, Suspense } from 'react';
const InvestorTable = lazy(
  () =>
    import('@/components/custom/InvestorSection/InvestorTable/InvestorTable')
);

export default function Members() {
  const { data: stats, error } = useInvestorsMetadata();
  if (error) toast.error('Error while fetch statistics');

  return (
    <Dialog>
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-4xl">Members</h2>
        </div>
        <DialogTrigger asChild>
          <button className="bg-white text-black px-4 py-2 rounded-none">
            Add member
          </button>
        </DialogTrigger>
      </header>
      <div className="mb-8">
        <small className="text-gray-500">Track whom you are onboarding</small>
      </div>
      <Tabs defaultValue="active" className="w-full my-5">
        <div className="w-full border-b-1 border-gray-600">
          <TabsList className="justify-start rounded-none bg-transparent border-b-0 p-0 w-[500px]">
            <TabsTrigger
              value="active"
              className="cursor-pointer text-white border-0 font-semibold data-[state=active]:bg-black data-[state=active]:border-b-2 data-[state=active]:border-white rounded-none px-4 py-2 text-lg"
            >
              Investors
            </TabsTrigger>
            <TabsTrigger
              value="closed"
              className="cursor-pointer text-white border-0 font-medium data-[state=active]:bg-black data-[state=active]:border-b-2 data-[state=active]:border-white rounded-none px-4 py-2 text-lg"
            >
              Bulk Onboard
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="active" className="w-full flex gap-5 flex-wrap">
          <StatisticCardList stats={stats?.metadata} />
          <Suspense fallback={<div>Loading...</div>}>
            <InvestorTable />
          </Suspense>
        </TabsContent>
        <TabsContent value="closed" className="w-full flex gap-5 flex-wrap">
          <BulkOnboarding />
        </TabsContent>
      </Tabs>
      <AddMemberDialog />
    </Dialog>
  );
}

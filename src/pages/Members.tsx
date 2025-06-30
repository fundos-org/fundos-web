import { useAppStateEffect } from '@/app/hooks';
import { RootState } from '@/app/store';
import { fetchMembersStatistics } from '@/axioscalls/dealApiServices';
import BulkOnboarding from '@/components/custom/BulkOnboarding';
import AddMemberDialog from '@/components/custom/modals/AddMemberDialog';
import StatisticCardList from '@/components/custom/StatisticCardList';
import InvestorTable from '@/components/custom/tables/InvestorTable';
import { DialogTrigger, Dialog } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Members() {
  const { inviteCode, subAdminId, statistics, members } = useAppStateEffect(
    (state: RootState) => state.member,
    fetchMembersStatistics
  );
  const investors_statistics = statistics?.investors_statistics;
  console.log(inviteCode, subAdminId);

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
              className="text-white border-0 font-semibold data-[state=active]:bg-black data-[state=active]:border-b-2 data-[state=active]:border-white rounded-none px-4 py-2 text-lg"
            >
              Investors
            </TabsTrigger>
            <TabsTrigger
              value="closed"
              className="text-white border-0 font-medium data-[state=active]:bg-black data-[state=active]:border-b-2 data-[state=active]:border-white rounded-none px-4 py-2 text-lg"
            >
              Bulk Onboard
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="active" className="w-full flex gap-5 flex-wrap">
          <StatisticCardList stats={investors_statistics} />
          <InvestorTable header="Investors" users={members?.investors || []} />
        </TabsContent>
        <TabsContent value="closed" className="w-full flex gap-5 flex-wrap">
          <BulkOnboarding />
        </TabsContent>
      </Tabs>
      <AddMemberDialog />
    </Dialog>
  );
}

import AddMemberDialog from "@/components/custom/AddMemberDialog";
import { InvestorsTable } from "@/components/custom/InvestorsTable";
import StatisticCardList from "@/components/custom/StatisticCardList";
import { DialogTrigger, Dialog } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Members() {
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
        <small className="text-gray-500">
          Track whom you are onboarding
        </small>
      </div>
      <Tabs defaultValue="active" className="w-full my-5">
      <div className="w-full border-b-1 border-gray-600">
        <TabsList className="justify-start rounded-none bg-transparent border-b-0 p-0 w-[500px]">
          <TabsTrigger
            value="active"
            className="text-white border-0 font-semibold data-[state=active]:bg-black data-[state=active]:border-b-2 data-[state=active]:border-white rounded-none px-4 py-2 text-lg">
            Investors
          </TabsTrigger>
          <TabsTrigger
            value="closed"
            className="text-white border-0 font-medium data-[state=active]:bg-black data-[state=active]:border-b-2 data-[state=active]:border-white rounded-none px-4 py-2 text-lg">
            Startups
          </TabsTrigger>
        </TabsList>
        </div>
        <TabsContent value="active" className="w-full flex gap-5 flex-wrap">
        <StatisticCardList />
      </TabsContent>
      <TabsContent value="closed" className="w-full flex gap-5 flex-wrap">
        <StatisticCardList />
      </TabsContent>
        </Tabs>
      <InvestorsTable />
      <AddMemberDialog/>
    </Dialog>
  );
}

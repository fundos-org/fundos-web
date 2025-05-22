import { useAppStateEffect } from "@/app/hooks";
import { RootState } from "@/app/store";
import { fetchDealStatistics } from "@/axioscalls/dealApiServices";
import CreateDealDialog from "@/components/custom/modals/CreateDealDialog";
import ShowDeals from "@/components/custom/ShowDeals";
import StatisticCardList from "@/components/custom/StatisticCardList";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";

function Deals() {
  const stats = useAppStateEffect(
      (state: RootState) => state.deals.statistics,
      fetchDealStatistics
    );
  return (
    <>
      <Dialog>
        <header className="flex justify-between items-center">
          <div>
        <h2 className="text-4xl">Deals</h2>
          </div>
          <DialogTrigger asChild>
        <button className="bg-white text-black px-4 py-2 rounded-none">
          Create New Deal
        </button>
          </DialogTrigger>
        </header>
        <div className="mb-8">
          <small className="text-gray-500">
        Track how your deals are performing and manage your portfolio
          </small>
        </div>
        <StatisticCardList stats={stats as Record<string, string | number> | undefined} />
        <ShowDeals />
        <CreateDealDialog />
      </Dialog>
    </>
  );
}

export default Deals;

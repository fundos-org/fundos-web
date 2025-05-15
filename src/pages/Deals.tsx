
import { useAppStateEvent } from "@/app/hooks";
import { RootState } from "@/app/store";
import createDraft from "@/axioscalls/dealApiServices";
import CreateDealDialog from "@/components/custom/CreateDealDialog";
import ShowDeals from "@/components/custom/ShowDeals";
import StatisticCardList from "@/components/custom/StatisticCardList";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";

function Deals() {
  const {dispatchThunk, selected} = useAppStateEvent((state: RootState) => state.deals)

  return (
    <>
      <Dialog>
        <header className="flex justify-between items-center">
          <div>
            <h2 className="text-4xl">Deals</h2>
          </div>
          <DialogTrigger asChild>
            <button
              className="bg-white text-black px-4 py-2 rounded-none"
              onClick={() => dispatchThunk(createDraft)}>
              Create New Deal
            </button>
          </DialogTrigger>
        </header>
        <div className="mb-8">
          <small className="text-gray-500">
            Track how your deals are performing and manage your portfolio
          </small>
        </div>
        <StatisticCardList />
        <ShowDeals />
        <CreateDealDialog dealId={selected.dealId} />
      </Dialog>
    </>
  );
}

export default Deals;

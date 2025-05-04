import ShowDeals from "@/components/custom/ShowDeals";
import StatisticCardList from "@/components/custom/StatisticCardList";

function Deals() {
  return (
    <>
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-4xl">Deals</h2>
        </div>
        <button className="bg-white text-black px-4 py-2 rounded-none">
          Create New Deal
        </button>
      </header>
      <div className="mb-8">
        <small className="text-gray-500">
          Track how your deals are performing and manage your portfolio
        </small>
      </div>
      <StatisticCardList />
      <ShowDeals />
    </>
  );
}

export default Deals;

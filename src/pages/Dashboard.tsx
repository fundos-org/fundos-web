import ActivitesList from "@/components/custom/ActivitesList";
import OverViewChart from "@/components/custom/OverViewChart";
import StatisticCardList from "@/components/custom/StatisticCardList";
import TransactionDetailsTable from "@/components/custom/TransactionDetailsTable";

function Dashboard() {
  return (
    <>
      <h2 className="text-4xl">Welcome Back, Kota</h2>
      <div className="mb-8">
          <small className="text-gray-500">
            Measure your advertising ROI and report website traffic
          </small>
          </div>
      <StatisticCardList />
      <div className="w-full flex gap-5 mb-5">
        <OverViewChart />
        <ActivitesList />
      </div>
      <TransactionDetailsTable />
    </>
  );
}

export default Dashboard;

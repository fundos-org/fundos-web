import ActivitesList from "@/components/custom/ActivitesList";
import OverViewChart from "@/components/custom/OverViewChart";
import StatisticCardList from "@/components/custom/StatisticCardList";
import TransactionDetailsTable from "@/components/custom/TransactionDetailsTable";

function Dashboard() {
  return (
    <>
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

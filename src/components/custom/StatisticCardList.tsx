import { Card, CardContent } from "../ui/card";

const stats = [
  { title: "Total Capital Committed", value: "508K" },
  { title: "Startup Listings", value: "23" },
  { title: "Investors Onboarded", value: "756" },
  { title: "Deals This Month", value: "30" },
];

function StatisticCardList() {
  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map(({ title, value }, index) => (
        <Card
          key={index}
          className=" bg-[#1f1f1f] text-white rounded-none border-0">
          <CardContent className="px-6">
            <p className="uppercase text-sm text-gray-400 tracking-wide">
              {title}
            </p>
            <p className="text-4xl font-bold mt-2">{value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default StatisticCardList;

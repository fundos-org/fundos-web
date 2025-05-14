import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import DealCard from "./DealCard";
import { allDealsTrigger } from "@/axioscalls/dealApiServices";
import { DealType } from "@/constants/dealsConstant";

export default function ShowDeals() {
  const [deals, setDeals] = useState<DealType[]>([])

  const callApi = async () => {
    try {
      const data = await allDealsTrigger();
      setDeals(data.filter((item: DealType) => item.status == 'open'));
    } catch (error) {
      console.error('Error fetching deals:', error);
    }
  };

  useEffect(() => {
    callApi()
  },[])

  return (
    <Tabs defaultValue="active" className="w-full mt-5">
      <div className="w-full border-b-1 border-gray-600">
        <TabsList className="justify-start rounded-none bg-transparent border-b-0 p-0 w-[500px]">
          <TabsTrigger
            value="active"
            className="text-white border-0 font-semibold data-[state=active]:bg-black data-[state=active]:border-b-2 data-[state=active]:border-white rounded-none px-4 py-2 text-lg">
            Active deals
          </TabsTrigger>
          <TabsTrigger
            value="closed"
            className="text-white border-0 font-medium data-[state=active]:bg-black data-[state=active]:border-b-2 data-[state=active]:border-white rounded-none px-4 py-2 text-lg">
            Closed deals
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="active" className="w-full flex gap-5 flex-wrap">
        {deals.map((deal, index) => (
          <DealCard deal={deal} key={index} />
        ))}
      </TabsContent>
      <TabsContent value="closed" className="w-full flex gap-5 flex-wrap">
        {deals.map((deal, index) => (
          <DealCard deal={deal} key={index} />
        ))}
      </TabsContent>
    </Tabs>
  );
}

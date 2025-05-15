import { RootState } from "@/app/store";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import DealCard from "./DealCard";
import { useAppStateEffect } from "@/app/hooks";
import { fetchAllDeals } from "@/axioscalls/dealApiServices";

export default function ShowDeals() {
  // const dispatch = useAppDispatch();
  // const deals = useAppSelector((state: RootState) => state.deals.deals);
  // useEffect(() => {
  //   dispatch(fetchAllDeals())
  // },[dispatch])
  const { deals } = useAppStateEffect(
    (state: RootState) => state.deals,
    fetchAllDeals
  );

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

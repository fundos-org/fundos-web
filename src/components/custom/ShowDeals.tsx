import { RootState } from '@/app/store';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import CardDeal from './DealCard';
import { useAppStateEffect } from '@/app/hooks';
import { fetchAllDeals } from '@/axioscalls/dealApiServices';
import { DealCard } from '@/constants/dealsConstant';

export default function ShowDeals() {
  // const dispatch = useAppDispatch();
  const { activeDeals, closedDeals } = useAppStateEffect(
    (state: RootState) =>
      state.deals.allDeals || { activeDeals: [], closedDeals: [] },
    fetchAllDeals
  );
  // const callAllDealsApi = useCallback(async () => {
  //   try {
  //     await toastifyThunk(fetchAllDeals(), dispatch, {
  //       loading: "Fetching all deals...",
  //       success: () => {
  //         return `Fetched user: All deals fetched!`;
  //       },
  //       error: (error) => `Error: ${error}`,
  //     });
  //   } catch (error) {
  //     // Errors are handled by toast, but you can add additional logic here if needed
  //     console.error("Toastified thunk error:", error);
  //   }
  // }, [dispatch]);

  // useEffect(() => {
  //   if (!activeDeals || !closedDeals) callAllDealsApi();
  // }, [dispatch, callAllDealsApi, activeDeals, closedDeals]);
  return (
    <Tabs defaultValue="active" className="w-full mt-5">
      <div className="w-full border-b-1 border-gray-600">
        <TabsList className="justify-start rounded-none bg-transparent border-b-0 p-0 w-[500px]">
          <TabsTrigger
            value="active"
            className="text-white border-0 font-semibold data-[state=active]:bg-black data-[state=active]:border-b-2 data-[state=active]:border-white rounded-none px-4 py-2 text-lg"
          >
            Active deals
          </TabsTrigger>
          <TabsTrigger
            value="closed"
            className="text-white border-0 font-medium data-[state=active]:bg-black data-[state=active]:border-b-2 data-[state=active]:border-white rounded-none px-4 py-2 text-lg"
          >
            Closed deals
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="active" className="w-full flex gap-5 flex-wrap">
        {activeDeals?.map((deal: DealCard, index: number) => (
          <CardDeal deal={deal} key={index} />
        ))}
      </TabsContent>
      <TabsContent value="closed" className="w-full flex gap-5 flex-wrap">
        {closedDeals?.map((deal: DealCard, index: number) => (
          <CardDeal deal={deal} key={index} />
        ))}
      </TabsContent>
    </Tabs>
  );
}

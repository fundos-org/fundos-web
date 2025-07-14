import { lazy } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
const Dealcard = lazy(() => import('./DealCard'));
import { DealCard } from '@/constants/dealsConstant';
import { useDealsTable } from '@/hooks/customhooks/DealsHooks/useDealTable';

const ShowDeals = () => {
  const { data: deals } = useDealsTable();
  return (
    <Tabs defaultValue="active" className="w-full mt-5">
      <div className="w-full border-b-1 border-gray-600">
        <TabsList className="justify-start rounded-none bg-transparent border-b-0 p-0 w-[500px]">
          <TabsTrigger
            value="active"
            className="text-white border-0 cursor-pointer font-semibold data-[state=active]:bg-black data-[state=active]:border-b-2 data-[state=active]:border-white rounded-none px-4 py-2 text-lg"
          >
            Active Deals
          </TabsTrigger>
          <TabsTrigger
            value="closed"
            className="text-white border-0 cursor-pointer font-medium data-[state=active]:bg-black data-[state=active]:border-b-2 data-[state=active]:border-white rounded-none px-4 py-2 text-lg"
          >
            Closed Deals
          </TabsTrigger>
          <TabsTrigger
            value="on_hold"
            className="text-white border-0 cursor-pointer font-medium data-[state=active]:bg-black data-[state=active]:border-b-2 data-[state=active]:border-white rounded-none px-4 py-2 text-lg"
          >
            On-Hold Deals
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="active" className="w-full flex gap-5 flex-wrap">
        {deals?.active_deals?.map((deal: DealCard, index: number) => (
          <Dealcard deal={deal} key={index + 1} />
        ))}
      </TabsContent>
      <TabsContent value="closed" className="w-full flex gap-5 flex-wrap">
        {deals?.closed_deals?.map((deal: DealCard, index: number) => (
          <Dealcard deal={deal} key={index + 1} />
        ))}
      </TabsContent>
      <TabsContent value="on_hold" className="w-full flex gap-5 flex-wrap">
        {deals?.onhold_deals?.map((deal: DealCard, index: number) => (
          <Dealcard deal={deal} key={index + 1} />
        ))}
      </TabsContent>
    </Tabs>
  );
};

export default ShowDeals;

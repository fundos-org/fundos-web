import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FC, lazy, Suspense } from 'react';
const AboutInvestor = lazy(() => import('./AboutInvestor'));
const InvestorInvestments = lazy(() => import('./InvestorInvestments'));

const InvestorMainTab: FC<{ investor_id: string }> = ({ investor_id }) => {
  return (
    <Tabs defaultValue="about" className="w-full my-5">
      <div className="w-full border-b-1 border-gray-600">
        <TabsList className="justify-start rounded-none bg-transparent border-b-0 p-0 w-[500px]">
          <TabsTrigger
            value="about"
            className="cursor-pointer text-white border-0 data-[state=active]:bg-black data-[state=active]:border-b-2 data-[state=active]:border-white rounded-none px-4 py-2"
          >
            About
          </TabsTrigger>
          <TabsTrigger
            value="investments"
            className="cursor-pointer text-white border-0 font-medium data-[state=active]:bg-black data-[state=active]:border-b-2 data-[state=active]:border-white rounded-none px-4 py-2"
          >
            Investments
          </TabsTrigger>
          <TabsTrigger
            value="transactions"
            className="cursor-pointer text-white border-0 font-medium data-[state=active]:bg-black data-[state=active]:border-b-2 data-[state=active]:border-white rounded-none px-4 py-2"
          >
            Transactions
          </TabsTrigger>
          <TabsTrigger
            value="documents"
            className="cursor-pointer text-white border-0 font-medium data-[state=active]:bg-black data-[state=active]:border-b-2 data-[state=active]:border-white rounded-none px-4 py-2"
          >
            Documents
          </TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="about" className="w-full flex gap-5 flex-wrap">
        <Suspense fallback={<div>Loading...</div>}>
          <AboutInvestor investor_id={investor_id} />
        </Suspense>
      </TabsContent>
      <TabsContent value="investments" className="w-full flex gap-5 flex-wrap">
        <Suspense fallback={<div>Loading...</div>}>
          <InvestorInvestments investor_id={investor_id} />
        </Suspense>
      </TabsContent>
      <TabsContent
        value="transactions"
        className="w-full flex gap-5 flex-wrap"
      ></TabsContent>
      <TabsContent
        value="documents"
        className="w-full flex gap-5 flex-wrap"
      ></TabsContent>
    </Tabs>
  );
};
export default InvestorMainTab;

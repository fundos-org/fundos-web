import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FC, lazy, Suspense } from 'react';
const AboutDeal = lazy(() => import('./AboutDeal'));
const DealInvestments = lazy(() => import('./DealInvestments'));
const DealTransactions = lazy(() => import('./DealTransactions'));
const DealDocuments = lazy(() => import('./DealDocuments'));
const DealCommitments = lazy(() => import('./DealCommitments'));

const DealMainTab: FC<{ deal_id: string }> = ({ deal_id }) => {
  return (
    <Tabs defaultValue="about" className="w-full my-6">
      <div className="w-full border-b border-gray-200">
        <TabsList className="justify-start rounded-none bg-transparent border-b-0 p-0 w-full">
          <TabsTrigger
            value="about"
            className="cursor-pointer text-gray-600 border-0 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none px-4 py-3 hover:text-gray-900 transition-colors"
          >
            About
          </TabsTrigger>
          <TabsTrigger
            value="commitments"
            className="cursor-pointer text-gray-600 border-0 font-medium data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none px-4 py-3 hover:text-gray-900 transition-colors"
          >
            Commitments
          </TabsTrigger>
          <TabsTrigger
            value="investments"
            className="cursor-pointer text-gray-600 border-0 font-medium data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none px-4 py-3 hover:text-gray-900 transition-colors"
          >
            Investments
          </TabsTrigger>
          <TabsTrigger
            value="transactions"
            className="cursor-pointer text-gray-600 border-0 font-medium data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none px-4 py-3 hover:text-gray-900 transition-colors"
          >
            Transactions
          </TabsTrigger>
          <TabsTrigger
            value="documents"
            className="cursor-pointer text-gray-600 border-0 font-medium data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none px-4 py-3 hover:text-gray-900 transition-colors"
          >
            Documents
          </TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="about" className="w-full flex gap-5 flex-wrap">
        <Suspense fallback={<div>Loading...</div>}>
          <AboutDeal deal_id={deal_id} />
        </Suspense>
      </TabsContent>
      <TabsContent value="investments" className="w-full flex gap-5 flex-wrap">
        <Suspense fallback={<div>Loading...</div>}>
          <DealInvestments deal_id={deal_id} />
        </Suspense>
      </TabsContent>
      <TabsContent value="transactions" className="w-full flex gap-5 flex-wrap">
        <Suspense fallback={<div>Loading...</div>}>
          <DealTransactions deal_id={deal_id} />
        </Suspense>
      </TabsContent>
      <TabsContent value="documents" className="w-full flex gap-5 flex-wrap">
        <Suspense fallback={<div>Loading...</div>}>
          <DealDocuments deal_id={deal_id} />
        </Suspense>
      </TabsContent>
      <TabsContent value="commitments" className="w-full">
        <Suspense fallback={<div>Loading...</div>}>
          <DealCommitments deal_id={deal_id} />
        </Suspense>
      </TabsContent>
    </Tabs>
  );
};
export default DealMainTab;

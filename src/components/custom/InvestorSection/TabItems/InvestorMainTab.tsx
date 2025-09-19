import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FC, lazy, Suspense } from 'react';
const AboutInvestor = lazy(() => import('./AboutInvestor'));
const InvestorInvestments = lazy(() => import('./InvestorInvestments'));
const InvestorTransactions = lazy(() => import('./InvestorTransactions'));
const InvestorDocuments = lazy(() => import('./InvestorDocuments'));

const InvestorMainTab: FC<{ investor_id: string }> = ({ investor_id }) => {
  return (
    <Tabs defaultValue="about" className="w-full my-6">
      <TabsList className="w-full border-b border-gray-200 bg-transparent p-0 rounded-none justify-start">
        <TabsTrigger
          value="about"
          className="text-gray-600 border-0 rounded-none px-4 py-3 font-medium data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=active]:bg-transparent hover:text-gray-800 transition-colors"
        >
          About
        </TabsTrigger>
        <TabsTrigger
          value="investments"
          className="text-gray-600 border-0 rounded-none px-4 py-3 font-medium data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=active]:bg-transparent hover:text-gray-800 transition-colors"
        >
          Investments
        </TabsTrigger>
        <TabsTrigger
          value="transactions"
          className="text-gray-600 border-0 rounded-none px-4 py-3 font-medium data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=active]:bg-transparent hover:text-gray-800 transition-colors"
        >
          Transactions
        </TabsTrigger>
        <TabsTrigger
          value="documents"
          className="text-gray-600 border-0 rounded-none px-4 py-3 font-medium data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=active]:bg-transparent hover:text-gray-800 transition-colors"
        >
          Documents
        </TabsTrigger>
      </TabsList>
      <TabsContent value="about" className="w-full">
        <Suspense fallback={<div>Loading...</div>}>
          <AboutInvestor investor_id={investor_id} />
        </Suspense>
      </TabsContent>
      <TabsContent value="investments" className="w-full">
        <Suspense fallback={<div>Loading...</div>}>
          <InvestorInvestments investor_id={investor_id} />
        </Suspense>
      </TabsContent>
      <TabsContent value="transactions" className="w-full">
        <Suspense fallback={<div>Loading...</div>}>
          <InvestorTransactions investor_id={investor_id} />
        </Suspense>
      </TabsContent>
      <TabsContent value="documents" className="w-full">
        <Suspense fallback={<div>Loading...</div>}>
          <InvestorDocuments investor_id={investor_id} />
        </Suspense>
      </TabsContent>
    </Tabs>
  );
};
export default InvestorMainTab;

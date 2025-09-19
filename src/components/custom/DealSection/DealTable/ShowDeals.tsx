import { FC, lazy, useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../ui/tabs';
import { useDealTable } from '@/hooks/customhooks/DealsHooks/useDealTable';
import { RefreshCw } from 'lucide-react';
import { useSubadminIds } from '@/hooks/customhooks/SubAdminsHooks/useSubadminIds';
import { Button } from '@/components/ui/button';
import SubadminIdsSelect from '../../InvestorSection/CustomSelects/SubadminIdsSelect';
import { useNotification } from '@/components/custom/NotificationProvider';
const DealsTable = lazy(() => import('./DealsTable'));

const ShowDeals: FC<{ isSubadmin: boolean }> = ({ isSubadmin }) => {
  const [activePageNumber, setActivePageNumber] = useState<number>(1);
  const [activePageSize, setActivePageSize] = useState<number>(3);
  const [closedPageNumber, setClosedPageNumber] = useState<number>(1);
  const [closedPageSize, setClosedPageSize] = useState<number>(3);
  const [onholdPageNumber, setOnholdPageNumber] = useState<number>(1);
  const [onholdPageSize, setOnholdPageSize] = useState<number>(3);
  const [subadmin_id, setSubadmin_id] = useState<string | undefined>();
  const notification = useNotification();
  const { data: subadminIds, refetch: refetchIds } = useSubadminIds(isSubadmin);
  const { data, refetch, isLoading } = useDealTable(
    activePageNumber,
    activePageSize,
    closedPageNumber,
    closedPageSize,
    onholdPageNumber,
    onholdPageSize,
    subadmin_id
  );
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isRefreshing1, setIsRefreshing1] = useState<boolean>(false);
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const result = await refetch();
      if (result.data) {
        const totalDeals = (result.data.active_deals?.length || 0) + 
                          (result.data.closed_deals?.length || 0) + 
                          (result.data.onhold_deals?.length || 0);
        notification.success(
          'Deals Refreshed',
          `Successfully loaded ${totalDeals} deals across all categories`,
          { duration: 3000 }
        );
      }
    } finally {
      setTimeout(() => setIsRefreshing(false), 500); // Small delay for better UX
    }
  };

  useEffect(() => {
    if (!subadmin_id) {
      setSubadmin_id(subadminIds?.subadmins[0]?.subadmin_id);
    }
  }, [subadmin_id, subadminIds]);

  const handleSubAdminIdChange = (id: string) => setSubadmin_id(id);

  const handleRefreshIds = async () => {
    setIsRefreshing1(true);
    try {
      await refetchIds();
    } finally {
      setTimeout(() => setIsRefreshing1(false), 500);
    }
  };

  return (
    <>
      {!isSubadmin && (
        <div className="flex mt-5 gap-3">
          <SubadminIdsSelect
            list={subadminIds?.subadmins ?? []}
            handleChange={handleSubAdminIdChange}
            value={subadmin_id ?? ''}
            isItForDeals={true}
          />
          <Button
            onClick={handleRefreshIds}
            disabled={isRefreshing1}
            className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Refresh data"
          >
            <RefreshCw
              className={`w-5 h-5 text-gray-600 ${
                isRefreshing1 ? 'animate-spin' : ''
              } transition-transform duration-200`}
            />
          </Button>
        </div>
      )}

      <Tabs defaultValue="active" className="w-full mt-5">
        <div className="w-full border-b border-gray-200 flex justify-between">
          <TabsList className="justify-start rounded-none bg-transparent border-b-0 p-0 w-[500px]">
            <TabsTrigger
              value="active"
              className="text-gray-600 border-0 cursor-pointer font-semibold data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none px-4 py-2 text-lg hover:text-gray-900 transition-colors"
            >
              Active Deals
            </TabsTrigger>
            <TabsTrigger
              value="closed"
              className="text-gray-600 border-0 cursor-pointer font-medium data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none px-4 py-2 text-lg hover:text-gray-900 transition-colors"
            >
              Closed Deals
            </TabsTrigger>
            <TabsTrigger
              value="on_hold"
              className="text-gray-600 border-0 cursor-pointer font-medium data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none px-4 py-2 text-lg hover:text-gray-900 transition-colors"
            >
              On-Hold Deals
            </TabsTrigger>
          </TabsList>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing || isLoading}
            className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            title="Refresh data"
          >
            <RefreshCw
              className={`w-5 h-5 text-gray-600 ${
                isRefreshing || isLoading ? 'animate-spin' : ''
              } transition-transform duration-200`}
            />
          </button>
        </div>

        <TabsContent
          value="active"
          className="w-full pt-6"
        >
          {data?.active_deals && data.active_deals.length > 0 ? (
            <DealsTable
              deals={data?.active_deals}
              pageNumber={activePageNumber}
              setPageNumber={setActivePageNumber}
              pageSize={activePageSize}
              setPageSize={setActivePageSize}
              pagination={data?.active_pagination}
            />
          ) : (
            <div className="w-full flex flex-col items-center justify-center py-12 text-center bg-gray-50 rounded-lg border border-gray-200">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Active Deals Found</h3>
              <p className="text-gray-600 mb-4 max-w-md">
                You don't have any active deals yet. Create your first deal to start managing your investment opportunities.
              </p>
            </div>
          )}
        </TabsContent>
        <TabsContent
          value="closed"
          className="w-full pt-6"
        >
          {data?.closed_deals && data.closed_deals.length > 0 ? (
            <DealsTable
              deals={data?.closed_deals}
              pageNumber={closedPageNumber}
              setPageNumber={setClosedPageNumber}
              pageSize={closedPageSize}
              setPageSize={setClosedPageSize}
              pagination={data?.closed_pagination}
            />
          ) : (
            <div className="w-full flex flex-col items-center justify-center py-12 text-center bg-gray-50 rounded-lg border border-gray-200">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Closed Deals</h3>
              <p className="text-gray-600 mb-4 max-w-md">
                You don't have any closed deals yet. Completed deals will appear here once they reach their target.
              </p>
            </div>
          )}
        </TabsContent>
        <TabsContent
          value="on_hold"
          className="w-full pt-6"
        >
          {data?.onhold_deals && data.onhold_deals.length > 0 ? (
            <DealsTable
              deals={data?.onhold_deals}
              pageNumber={onholdPageNumber}
              setPageNumber={setOnholdPageNumber}
              pageSize={onholdPageSize}
              setPageSize={setOnholdPageSize}
              pagination={data?.onhold_pagination}
            />
          ) : (
            <div className="w-full flex flex-col items-center justify-center py-12 text-center bg-gray-50 rounded-lg border border-gray-200">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No On-Hold Deals</h3>
              <p className="text-gray-600 mb-4 max-w-md">
                You don't have any deals on hold. Paused or temporarily suspended deals will appear here.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </>
  );
};

export default ShowDeals;

import CreateDealDialog from '@/components/custom/modals/CreateDealDialog';
import StatisticCardList from '@/components/custom/StatisticCardList';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { useDealMetadata } from '@/hooks/customhooks/DealsHooks/useDealMetadata';
import isThisSubadmin from '@/lib/isSubadmin';
import { lazy, useState, Suspense } from 'react';
const ShowDeals = lazy(
  () => import('@/components/custom/DealSection/DealTable/ShowDeals')
);

function Deals() {
  const [isSubadmin] = useState<boolean>(isThisSubadmin);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { data: stats } = useDealMetadata(isSubadmin);
  const { subadmin_id, subadmin_name, success, ...rest } = stats || {};
  void subadmin_id;
  void success;
  void subadmin_name;
  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <header className="flex justify-between items-center">
          <div>
            <h2 className="text-4xl">Deals</h2>
          </div>
          {isSubadmin && (
            <DialogTrigger asChild>
              <button className="bg-white text-black px-4 py-2 rounded-none cursor-pointer">
                Create New Deal
              </button>
            </DialogTrigger>
          )}
        </header>
        <div className="mb-8">
          <small className="text-gray-500">
            Track how your deals are performing and manage your portfolio
          </small>
        </div>
        {isSubadmin && (
          <StatisticCardList
            stats={rest as Record<string, string | number> | undefined}
          />
        )}
        <Suspense fallback={<div>Loading...</div>}>
          <ShowDeals isSubadmin={isSubadmin} />
        </Suspense>
        <CreateDealDialog setIsDialogOpen={setIsDialogOpen} />
      </Dialog>
    </>
  );
}

export default Deals;

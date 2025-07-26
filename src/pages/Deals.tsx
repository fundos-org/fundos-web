import { useAppStateEffect } from '@/app/hooks';
import { RootState } from '@/app/store';
import { fetchDealStatistics } from '@/axioscalls/apiServices';
import CreateDealDialog from '@/components/custom/modals/CreateDealDialog';
import StatisticCardList from '@/components/custom/StatisticCardList';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { AppEnums } from '@/constants/enums';
import { lazy, useState, Suspense } from 'react';
const ShowDeals = lazy(
  () => import('@/components/custom/DealSection/DealTable/ShowDeals')
);
const returnBool = () => {
  const subadminDetailsRaw = sessionStorage.getItem(AppEnums.SUBADMIN_SESSION);
  const raw = subadminDetailsRaw ? JSON.parse(subadminDetailsRaw) : {};
  return raw?.role === 'subadmin';
};
function Deals() {
  const [isSubadmin] = useState<boolean>(returnBool);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const stats = useAppStateEffect(
    (state: RootState) => state.deals.statistics,
    fetchDealStatistics
  );
  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <header className="flex justify-between items-center">
          <div>
            <h2 className="text-4xl">Deals</h2>
          </div>
          <DialogTrigger asChild>
            <button className="bg-white text-black px-4 py-2 rounded-none cursor-pointer">
              Create New Deal
            </button>
          </DialogTrigger>
        </header>
        <div className="mb-8">
          <small className="text-gray-500">
            Track how your deals are performing and manage your portfolio
          </small>
        </div>
        {isSubadmin && (
          <StatisticCardList
            stats={stats as Record<string, string | number> | undefined}
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

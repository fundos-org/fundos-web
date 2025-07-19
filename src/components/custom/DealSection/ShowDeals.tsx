import { FC, lazy, useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
const Dealcard = lazy(() => import('./DealCard'));
import { DealCard } from '@/constants/dealsConstant';
import { useDeals } from '@/hooks/customhooks/DealsHooks/useDealTable';
import { RefreshCw } from 'lucide-react';
import { AppEnums } from '@/constants/enums';
import { useSubadminIds } from '@/hooks/customhooks/SubAdminsHooks/useSubadminIds';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';

const sessCapture = () => {
  const subadminDetailsRaw = sessionStorage.getItem(AppEnums.SUBADMIN_SESSION);
  const { subadmin_id } = subadminDetailsRaw
    ? JSON.parse(subadminDetailsRaw)
    : {};
  return subadmin_id;
};

const ShowDeals: FC<{ isSubadmin: boolean }> = ({ isSubadmin }) => {
  const [subadmin_id, setSubadmin_id] = useState<string | undefined>(
    sessCapture
  );
  const { data: subadminIds, refetch: refetchIds } = useSubadminIds(isSubadmin);
  const { data: deals, refetch, isLoading } = useDeals(subadmin_id);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isRefreshing1, setIsRefreshing1] = useState<boolean>(false);
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
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
        <div className="flex mt-5">
          <Select onValueChange={handleSubAdminIdChange} value={subadmin_id}>
            <SelectTrigger className="rounded-none w-[444px] cursor-pointer border border-[#383739] bg-black/40">
              <SelectValue placeholder="Select Sub-Admin" />
            </SelectTrigger>
            <SelectContent className="rounded-none">
              {subadminIds?.subadmins?.map(subadmin => (
                <SelectItem
                  key={subadmin?.subadmin_id}
                  value={String(subadmin?.subadmin_id)}
                >
                  {subadmin?.subadmin_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            onClick={handleRefreshIds}
            disabled={isRefreshing1}
            className="rounded-none border border-[#383739] cursor-pointer"
            title="Refresh data"
          >
            <RefreshCw
              className={`w-5 h-5 text-zinc-400 ${
                isRefreshing1 ? 'animate-spin' : null
              } transition-transform duration-200 hover:text-zinc-300`}
            />
          </Button>
        </div>
      )}

      <Tabs defaultValue="active" className="w-full mt-5">
        <div className="w-full border-b-1 border-gray-600 flex justify-between">
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
          <button
            onClick={handleRefresh}
            disabled={isRefreshing || isLoading}
            className="flex gap-3 p-2 bg-zinc-700 hover:bg-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 cursor-pointer"
            title="Refresh data"
          >
            {/* <span>Refresh:</span> */}
            <RefreshCw
              className={`w-5 h-5 text-zinc-400 ${
                isRefreshing || isLoading ? 'animate-spin' : null
              } transition-transform duration-200 hover:text-zinc-300`}
            />
          </button>
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
    </>
  );
};

export default ShowDeals;

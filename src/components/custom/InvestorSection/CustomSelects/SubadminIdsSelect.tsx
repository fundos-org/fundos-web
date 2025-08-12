import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SubadminId } from '@/constants/dashboardConstant';
import { FC } from 'react';

const SubadminIdsSelect: FC<{
  list: SubadminId[];
  handleChange: (value: string) => void;
  value: string;
  isItForDeals: boolean;
}> = ({ list, handleChange, value, isItForDeals }) => {
  return (
    <>
      <Select onValueChange={handleChange} value={value ?? ''}>
        <SelectTrigger className="rounded-none w-[250px] cursor-pointer border border-[#383739] bg-black/40">
          <SelectValue placeholder="Select Sub-Admin" />
        </SelectTrigger>
        <SelectContent className="rounded-none bg-black border border-gray-700 text-white">
          {list?.map(subadmin => (
            <SelectItem
              className="flex w-full justify-between rounded-none cursor-pointer"
              key={subadmin?.subadmin_id}
              value={String(subadmin?.subadmin_id)}
            >
              <span>{subadmin?.subadmin_name}</span>
              {isItForDeals ? (
                <span>(Users: {subadmin?.user_count})</span>
              ) : (
                <span>(Deals: {subadmin?.deal_count})</span>
              )}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
};

export default SubadminIdsSelect;

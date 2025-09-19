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
        <SelectTrigger className="rounded-lg w-[250px] cursor-pointer border border-gray-300 bg-white hover:bg-gray-50 transition-colors">
          <SelectValue placeholder="Select Sub Admin" />
        </SelectTrigger>
        <SelectContent className="rounded-lg bg-white border border-gray-200 shadow-lg">
          {list?.map(subadmin => (
            <SelectItem
              className="flex w-full justify-between rounded-md cursor-pointer hover:bg-gray-50 text-gray-900"
              key={subadmin?.subadmin_id}
              value={String(subadmin?.subadmin_id)}
            >
              <div className="flex w-full justify-between items-center">
                <span className="font-medium">{subadmin?.subadmin_name}</span>
                {!isItForDeals ? (
                  <span className="text-xs text-gray-500 ml-2">Users: {subadmin?.user_count}</span>
                ) : (
                  <span className="text-xs text-gray-500 ml-2">Deals: {subadmin?.deal_count}</span>
                )}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
};

export default SubadminIdsSelect;

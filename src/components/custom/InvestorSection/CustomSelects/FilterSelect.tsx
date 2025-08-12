import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FC } from 'react';

const FilterSelect: FC<{
  enumObject: Record<string, string>;
  handleChange: (value: string) => void;
  value: string;
  placeholder: string;
}> = ({ enumObject, handleChange, value, placeholder }) => {
  return (
    <>
      <Select onValueChange={handleChange} value={value}>
        <SelectTrigger className="rounded-none cursor-pointer border border-[#383739] bg-black/40">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="rounded-none bg-black border border-gray-700 text-white">
          {Object.values(enumObject).map(enumValue => (
            <SelectItem
              className="flex w-full justify-between rounded-none cursor-pointer"
              key={enumValue}
              value={enumValue}
            >
              {enumValue}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
};

export default FilterSelect;

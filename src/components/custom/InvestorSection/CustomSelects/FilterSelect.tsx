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
        <SelectTrigger className="border-none bg-transparent text-gray-900 font-semibold cursor-pointer flex items-center justify-between hover:bg-gray-50 transition-colors">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="bg-white border border-gray-200 rounded-lg shadow-lg">
          {enumObject &&
            Object.values(enumObject).map(enumValue => (
              <SelectItem
                className="cursor-pointer hover:bg-gray-50 text-gray-900"
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

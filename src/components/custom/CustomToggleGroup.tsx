import { Button } from '@/components/ui/button'; // Adjust path based on your setup

const CustomToggleGroup = ({
  array,
  value,
  setValue,
}: {
  array: { name: string; value: string }[];
  value: string;
  setValue: (value: string) => void;
}) => {
  return (
    <div className="flex flex-wrap gap-2">
      {array.map(({ name, value: val }) => (
        <Button
          key={name}
          onClick={() => setValue(val)}
          className={`px-4 py-2 rounded-lg border transition-colors font-medium ${
            val === value
              ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700'
              : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
          }`}
        >
          {name}
        </Button>
      ))}
    </div>
  );
};

export default CustomToggleGroup;

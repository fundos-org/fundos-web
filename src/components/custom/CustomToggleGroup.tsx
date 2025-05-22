import { Button } from '@/components/ui/button'; // Adjust path based on your setup

const CustomToggleGroup = ({
  array,
  value,
  setValue,
}: {
  array: { name: string; value: string }[];
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
}) => {
  return (
    <div className="flex flex-wrap gap-2">
      {array.map(({ name, value: val }) => (
        <Button
          key={name}
          onClick={() => setValue(val)}
          className={`px-4 py-2 rounded-none transition-colors ${
            val === value
              ? 'bg-white text-black'
              : 'bg-[#2a2a2a] text-white hover:bg-gray-700'
          }`}
        >
          {name}
        </Button>
      ))}
    </div>
  );
};

export default CustomToggleGroup;

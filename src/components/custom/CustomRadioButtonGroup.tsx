import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Stages } from '@/constants/dealsConstant';

const CustomRadioButtonGroup = ({
  stages,
  value,
  setValue,
}: {
  stages: Stages[];
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
}) => {
  return (
    <RadioGroup
      value={value}
      onValueChange={setValue}
      className="grid grid-cols-2 gap-2 bg-[#1a1a1a] rounded-lg"
    >
      {stages.map(stage => (
        <div
          key={stage.value}
          className="flex items-start space-x-2 p-4 bg-[#1a1a1a] border-[#2a2a2a] border-2 rounded-none"
        >
          <Label
            htmlFor={stage.value}
            className="flex flex-col items-start text-white text-lg font-semibold"
          >
            <span>{stage.title}</span>
            <p className="text-zinc-500 text-sm">{stage.description}</p>
          </Label>
          <RadioGroupItem
            value={stage.value}
            id={stage.value}
            className="mt-1 border-white text-white"
          />
        </div>
      ))}
    </RadioGroup>
  );
};

export default CustomRadioButtonGroup;

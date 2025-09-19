import * as RadioGroup from '@radix-ui/react-radio-group';
import { CircleCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Stages } from '@/constants/dealsConstant';

const NewCustomRadioGroup = ({
  stages,
  value,
  setValue,
}: {
  stages: Stages[];
  value: string;
  setValue: (value: string) => void;
}) => {
  return (
    <RadioGroup.Root
      value={value}
      onValueChange={setValue}
      className="w-full grid grid-cols-2 gap-4"
    >
      {stages.map(stage => (
        <RadioGroup.Item
          key={stage.value}
          value={stage.value}
          id={stage.value}
          className={cn(
            'cursor-pointer relative group py-3 px-4 text-start bg-gray-50 border border-gray-200 rounded-lg transition-colors hover:bg-gray-100',
            'data-[state=checked]:bg-blue-50 data-[state=checked]:border-blue-300 data-[state=checked]:ring-1 data-[state=checked]:ring-blue-200'
          )}
        >
          <CircleCheck
            className={cn(
              'absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 h-6 w-6 text-primary fill-blue-500 stroke-white',
              'group-data-[state=unchecked]:hidden'
            )}
          />
          <span className="font-semibold tracking-tight text-gray-900 text-lg">
            {stage.title}
          </span>
          <p className="text-gray-600 text-sm">{stage.description}</p>
        </RadioGroup.Item>
      ))}
    </RadioGroup.Root>
  );
};

export default NewCustomRadioGroup;

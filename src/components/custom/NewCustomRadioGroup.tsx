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
      className="w-full grid grid-cols-2 gap-4 bg-[#1a1a1a]"
    >
      {stages.map(stage => (
        <RadioGroup.Item
          key={stage.value}
          value={stage.value}
          id={stage.value}
          className={cn(
            'cursor-pointer relative group ring-[1px] ring-[#2a2a2a] py-2 px-3 text-start bg-[#1a1a1a] border border-[#404040]',
            'data-[state=checked]:ring-1 data-[state=checked]:bg-[#38373970] data-[state=checked]:ring-zinc-400'
          )}
        >
          <CircleCheck
            className={cn(
              'absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 h-6 w-6 text-primary fill-blue-500 stroke-white',
              'group-data-[state=unchecked]:hidden'
            )}
          />
          <span className="font-semibold tracking-tight text-white text-lg">
            {stage.title}
          </span>
          <p className="text-zinc-500 text-sm">{stage.description}</p>
        </RadioGroup.Item>
      ))}
    </RadioGroup.Root>
  );
};

export default NewCustomRadioGroup;

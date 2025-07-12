import * as React from 'react';
import * as SwitchPrimitives from '@radix-ui/react-switch';
import { cn } from '@/lib/utils'; // Make sure this utility is typed correctly
import { Check, X } from 'lucide-react';

// Custom Switch component using Radix and supporting icons
const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root> & {
    icon?: React.ReactNode;
    thumbClassName?: string;
  }
>(function Switch({ className, icon, thumbClassName, ...props }, ref) {
  return (
    <SwitchPrimitives.Root
      className={cn(
        'peer inline-flex h-5 w-14 shrink-0 cursor-pointer items-center rounded-none border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input',
        className
      )}
      {...props}
      ref={ref}
    >
      <SwitchPrimitives.Thumb
        className={cn(
          'pointer-events-none flex h-4 w-4 rounded-none bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0 items-center justify-center',
          thumbClassName
        )}
      >
        {icon ?? null}
      </SwitchPrimitives.Thumb>
    </SwitchPrimitives.Root>
  );
});
Switch.displayName = 'Switch';

const SwitchCustom: React.FC = () => {
  const [checked, setChecked] = React.useState(false);

  return (
    <Switch
      icon={
        checked ? (
          <Check className="h-4 w-4 text-black" />
        ) : (
          <X className="h-4 w-4 text-black" />
        )
      }
      checked={checked}
      onCheckedChange={setChecked}
      className="h-7 w-14 border border-[#383739]"
      thumbClassName="h-6 w-7 data-[state=checked]:translate-x-6"
    />
  );
};

export default SwitchCustom;

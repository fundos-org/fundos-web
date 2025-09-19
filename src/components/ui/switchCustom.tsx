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

interface SwitchCustomProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
}

const SwitchCustom: React.FC<SwitchCustomProps> = ({ 
  checked = false, 
  onCheckedChange,
  disabled = false,
  label 
}) => {
  const [internalChecked, setInternalChecked] = React.useState(checked);
  
  const handleChange = (newChecked: boolean) => {
    setInternalChecked(newChecked);
    onCheckedChange?.(newChecked);
  };

  const isChecked = onCheckedChange ? checked : internalChecked;

  return (
    <div className="flex items-center gap-2">
      <Switch
        icon={
          isChecked ? (
            <Check className="h-3 w-3 text-white" />
          ) : (
            <X className="h-3 w-3 text-gray-600" />
          )
        }
        checked={isChecked}
        onCheckedChange={handleChange}
        disabled={disabled}
        className={`h-6 w-11 border border-gray-300 rounded-full transition-colors ${
          isChecked 
            ? 'bg-green-600 border-green-600' 
            : 'bg-gray-200 border-gray-300'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        thumbClassName={`h-4 w-4 rounded-full data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0 ${
          isChecked ? 'bg-white' : 'bg-white'
        }`}
      />
      {label && (
        <span className="text-sm text-gray-700 font-medium">{label}</span>
      )}
    </div>
  );
};

export default SwitchCustom;

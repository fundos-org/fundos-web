import { AlertCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ErrorAlertProps {
  message: string;
  onDismiss?: () => void;
  className?: string;
  variant?: 'error' | 'warning' | 'info';
}

const ErrorAlert = ({ 
  message, 
  onDismiss, 
  className,
  variant = 'error' 
}: ErrorAlertProps) => {
  const variantStyles = {
    error: {
      container: 'bg-red-50 border-red-200 text-red-800',
      icon: 'text-red-500',
      iconBg: 'bg-red-100'
    },
    warning: {
      container: 'bg-amber-50 border-amber-200 text-amber-800',
      icon: 'text-amber-500', 
      iconBg: 'bg-amber-100'
    },
    info: {
      container: 'bg-blue-50 border-blue-200 text-blue-800',
      icon: 'text-blue-500',
      iconBg: 'bg-blue-100'
    }
  };

  const styles = variantStyles[variant];

  return (
    <div className={cn(
      'p-4 rounded-lg border transition-all duration-300 ease-in-out',
      styles.container,
      'animate-in slide-in-from-top-2 fade-in duration-300',
      className
    )}>
      <div className="flex items-start">
        <div className={cn(
          'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-3',
          styles.iconBg
        )}>
          <AlertCircle className={cn('w-4 h-4', styles.icon)} />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium leading-relaxed">
            {message}
          </p>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className={cn(
              'flex-shrink-0 ml-2 p-1 rounded-full hover:bg-black/5 transition-colors',
              styles.icon
            )}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorAlert;

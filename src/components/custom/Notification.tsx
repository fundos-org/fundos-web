import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle, Info, X, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface NotificationConfig {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  duration?: number;
  persistent?: boolean;
}

interface NotificationProps extends NotificationConfig {
  onClose: (id: string) => void;
}

const Notification: React.FC<NotificationProps> = ({
  id,
  type,
  title,
  message,
  duration = 5000,
  persistent = false,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!persistent && duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => onClose(id), 300); // Wait for exit animation
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [id, duration, persistent, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose(id), 300);
  };

  // Use consistent light theme with vibrant colors matching deal status
  const typeStyles = {
    success: {
      container: 'bg-green-50 border-green-300 shadow-lg shadow-green-200/50',
      iconBg: 'bg-green-600',
      icon: 'text-white',
      title: 'text-green-800',
      message: 'text-green-700',
      closeBtn: 'text-green-600 hover:text-green-800',
      IconComponent: CheckCircle,
    },
    error: {
      container: 'bg-red-50 border-red-300 shadow-lg shadow-red-200/50',
      iconBg: 'bg-red-600',
      icon: 'text-white',
      title: 'text-red-800',
      message: 'text-red-700',
      closeBtn: 'text-red-600 hover:text-red-800',
      IconComponent: XCircle,
    },
    warning: {
      container: 'bg-yellow-50 border-yellow-300 shadow-lg shadow-yellow-200/50',
      iconBg: 'bg-yellow-600',
      icon: 'text-white',
      title: 'text-yellow-800',
      message: 'text-yellow-700',
      closeBtn: 'text-yellow-600 hover:text-yellow-800',
      IconComponent: AlertCircle,
    },
    info: {
      container: 'bg-blue-50 border-blue-300 shadow-lg shadow-blue-200/50',
      iconBg: 'bg-blue-600',
      icon: 'text-white',
      title: 'text-blue-800',
      message: 'text-blue-700',
      closeBtn: 'text-blue-600 hover:text-blue-800',
      IconComponent: Info,
    },
  };

  const styles = typeStyles[type];
  const { IconComponent } = styles;

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -30, scale: 0.9 }}
      transition={{ 
        type: "spring", 
        stiffness: 400, 
        damping: 25,
        opacity: { duration: 0.3 }
      }}
      layout
      className={cn(
        'fundos-notification',
        'w-full max-w-sm p-3 border rounded-lg shadow-lg backdrop-blur-sm block',
        styles.container
      )}
    >
      <div className="flex items-start space-x-2">
        {/* Icon */}
        <div className={cn('flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center', styles.iconBg)}>
          <IconComponent className={cn('w-4 h-4', styles.icon)} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h4 className={cn('text-xs font-semibold leading-4', styles.title)}>
            {title}
          </h4>
          {message && (
            <p className={cn('mt-0.5 text-xs leading-4', styles.message)}>
              {message}
            </p>
          )}
        </div>

        {/* Close Button */}
        <button
          onClick={handleClose}
          className={cn(
            'flex-shrink-0 p-0.5 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
            styles.closeBtn,
            'focus:ring-current'
          )}
          aria-label="Close notification"
        >
          <X className="w-3 h-3" />
        </button>
      </div>

      {/* Progress bar for timed notifications */}
      {!persistent && duration > 0 && (
        <motion.div
          className="mt-2 h-0.5 bg-black/10 rounded-full overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <motion.div
            className={cn('h-full rounded-full', {
              'bg-green-600': type === 'success',
              'bg-red-600': type === 'error',
              'bg-yellow-600': type === 'warning',
              'bg-blue-600': type === 'info',
            })}
            initial={{ width: '100%' }}
            animate={{ width: '0%' }}
            transition={{ duration: duration / 1000, ease: 'linear' }}
          />
        </motion.div>
      )}
    </motion.div>
  );
};

export default Notification;

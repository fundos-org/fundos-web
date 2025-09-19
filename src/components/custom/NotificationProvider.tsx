import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { AnimatePresence } from 'framer-motion';
import Notification, { NotificationConfig } from './Notification';

interface NotificationContextType {
  showNotification: (config: Omit<NotificationConfig, 'id'>) => string;
  hideNotification: (id: string) => void;
  clearAllNotifications: () => void;
  // Convenience methods
  success: (title: string, message?: string, options?: Partial<NotificationConfig>) => string;
  error: (title: string, message?: string, options?: Partial<NotificationConfig>) => string;
  warning: (title: string, message?: string, options?: Partial<NotificationConfig>) => string;
  info: (title: string, message?: string, options?: Partial<NotificationConfig>) => string;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
  children: ReactNode;
  maxNotifications?: number;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
  maxNotifications = 5,
  position = 'top-right',
}) => {
  const [notifications, setNotifications] = useState<NotificationConfig[]>([]);

  const generateId = useCallback(() => {
    return `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  const showNotification = useCallback((config: Omit<NotificationConfig, 'id'>) => {
    const id = generateId();
    const newNotification: NotificationConfig = {
      ...config,
      id,
      duration: config.duration ?? 5000,
    };

    setNotifications(prev => {
      const updated = [newNotification, ...prev];
      // Limit the number of notifications
      return updated.slice(0, maxNotifications);
    });

    return id;
  }, [generateId, maxNotifications]);

  const hideNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Convenience methods
  const success = useCallback((title: string, message?: string, options?: Partial<NotificationConfig>) => {
    return showNotification({
      type: 'success',
      title,
      message,
      ...options,
    });
  }, [showNotification]);

  const error = useCallback((title: string, message?: string, options?: Partial<NotificationConfig>) => {
    return showNotification({
      type: 'error',
      title,
      message,
      ...options,
    });
  }, [showNotification]);

  const warning = useCallback((title: string, message?: string, options?: Partial<NotificationConfig>) => {
    return showNotification({
      type: 'warning',
      title,
      message,
      ...options,
    });
  }, [showNotification]);

  const info = useCallback((title: string, message?: string, options?: Partial<NotificationConfig>) => {
    return showNotification({
      type: 'info',
      title,
      message,
      ...options,
    });
  }, [showNotification]);

  const value: NotificationContextType = {
    showNotification,
    hideNotification,
    clearAllNotifications,
    success,
    error,
    warning,
    info,
  };

  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2',
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      
      {/* Notification Container */}
      <div className={`notification-container ${positionClasses[position]}`}>
        <AnimatePresence mode="sync" initial={false}>
          {notifications.map((notification) => (
            <Notification
              key={notification.id}
              {...notification}
              onClose={hideNotification}
            />
          ))}
        </AnimatePresence>
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export default NotificationProvider;

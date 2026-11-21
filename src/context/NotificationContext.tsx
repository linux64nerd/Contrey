import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { InAppNotification, Trip } from '../types/trip';
import { Expense } from '../types/expense';
import { evaluateTripUrgency, sendBrowserPushNotification, UrgencyAnalysis } from '../services/urgencyService';
import { storageService, STORAGE_KEYS } from '../services/storageService';
import { toast } from 'sonner';

interface NotificationContextType {
  notifications: InAppNotification[];
  unreadCount: number;
  hasPushPermission: boolean;
  requestPushPermission: () => Promise<boolean>;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
  currentUrgency: UrgencyAnalysis | null;
  dismissUrgencyBanner: () => void;
  isUrgencyBannerDismissed: boolean;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{
  activeTrip: Trip | null;
  expenses: Expense[];
  children: React.ReactNode;
}> = ({ activeTrip, expenses, children }) => {
  const [notifications, setNotifications] = useState<InAppNotification[]>(() => {
    return storageService.getItem<InAppNotification[]>(STORAGE_KEYS.NOTIFICATIONS, [
      {
        id: 'notif_welcome',
        title: 'Welcome to Contrey PRO',
        message: 'Your travel expense manager is fully active. Turn on push notifications for spend alerts.',
        severity: 'info',
        timestamp: new Date().toISOString(),
        read: false,
      },
    ]);
  });

  const [hasPushPermission, setHasPushPermission] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      return Notification.permission === 'granted';
    }
    return false;
  });

  const [isUrgencyBannerDismissed, setIsUrgencyBannerDismissed] = useState<boolean>(false);
  const lastAlertKeyRef = useRef<string>('');

  // Persist notifications
  useEffect(() => {
    storageService.setItem(STORAGE_KEYS.NOTIFICATIONS, notifications);
  }, [notifications]);

  // Evaluate urgency whenever activeTrip or expenses change
  const currentUrgency = activeTrip ? evaluateTripUrgency(activeTrip, expenses) : null;

  useEffect(() => {
    if (!currentUrgency || currentUrgency.alerts.length === 0) return;

    // Check if new alert generated
    const alertSignature = `${activeTrip?.id || ''}:${currentUrgency.alerts.map((a) => a.title).join('|')}`;
    if (alertSignature !== lastAlertKeyRef.current) {
      lastAlertKeyRef.current = alertSignature;
      setIsUrgencyBannerDismissed(false); // reset banner so user sees the new alert

      // Add to persistent in-app notifications if not already recorded recently
      currentUrgency.alerts.forEach((alert) => {
        setNotifications((prev) => {
          const isRecentDuplicate = prev.some(
            (n) => n.title === alert.title && n.tripId === activeTrip?.id
          );
          if (isRecentDuplicate) return prev;

          const newNotif: InAppNotification = {
            id: `notif_${Date.now()}_${Math.random().toString(36).substring(7)}`,
            tripId: activeTrip?.id,
            title: alert.title,
            message: alert.message,
            severity: alert.severity,
            timestamp: new Date().toISOString(),
            read: false,
          };
          return [newNotif, ...prev.slice(0, 39)];
        });

        // Trigger native browser notification
        sendBrowserPushNotification(alert.title, alert.message);

        // Also trigger high-priority Sonner toast
        if (alert.severity === 'urgent') {
          toast.error(alert.title, {
            description: alert.message,
            duration: 7000,
          });
        } else {
          toast.warning(alert.title, {
            description: alert.message,
            duration: 5000,
          });
        }
      });
    }
  }, [currentUrgency, activeTrip?.id]);

  const requestPushPermission = async (): Promise<boolean> => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      toast.error('Browser Push Notifications are not supported on this platform');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      const granted = permission === 'granted';
      setHasPushPermission(granted);

      if (granted) {
        toast.success('Push Notifications Enabled! 🔔', {
          description: 'You will receive instant urgency alerts when budgets hit critical levels.',
        });
        sendBrowserPushNotification('Contrey Alerts Active', 'You will receive real-time budget reminders!');
      } else {
        toast.info('Push notifications blocked or dismissed. In-app alerts remain active.');
      }
      return granted;
    } catch (e) {
      console.warn('Error requesting notification permission', e);
      return false;
    }
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    toast.info('All notifications marked as read');
  };

  const clearAll = () => {
    setNotifications([]);
    toast.info('Notification history cleared');
  };

  const dismissUrgencyBanner = () => {
    setIsUrgencyBannerDismissed(true);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        hasPushPermission,
        requestPushPermission,
        markAsRead,
        markAllAsRead,
        clearAll,
        currentUrgency,
        dismissUrgencyBanner,
        isUrgencyBannerDismissed,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

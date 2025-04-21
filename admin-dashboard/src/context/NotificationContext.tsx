import React, { createContext, useContext, useState, useEffect } from 'react';
import { Notification } from '../types';
import { useAuth } from './AuthContext';
import NotificationService from '../services/NotificationService';
import { PushNotificationService } from '../services/PushNotificationService';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (notificationId: string) => Promise<void>;
  createNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  requestPushPermission: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuth();

  // Initialize push notifications
  useEffect(() => {
    if (user) {
      const initializePushNotifications = async () => {
        try {
          await PushNotificationService.initialize();
        } catch (err) {
          console.error('Error initializing push notifications:', err);
        }
      };
      
      initializePushNotifications();
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      setNotifications([]);
      setUnreadCount(0);
      setLoading(false);
      return;
    }

    setLoading(true);
    
    // Set up real-time listener for notifications
    const unsubscribe = NotificationService.getNotificationsForUser(
      user.uid,
      (notificationsData) => {
        setNotifications(notificationsData);
        setUnreadCount(notificationsData.filter(n => !n.read).length);
        setLoading(false);
      }
    );

    // Clean up listener on unmount
    return () => {
      unsubscribe();
    };
  }, [user]);

  const markAsRead = async (notificationId: string) => {
    try {
      await NotificationService.markAsRead(notificationId);
    } catch (err) {
      setError('Failed to mark notification as read');
      console.error(err);
    }
  };

  const markAllAsRead = async () => {
    if (!user) return;
    
    try {
      await NotificationService.markAllAsRead(user.uid);
    } catch (err) {
      setError('Failed to mark all notifications as read');
      console.error(err);
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      await NotificationService.deleteNotification(notificationId);
    } catch (err) {
      setError('Failed to delete notification');
      console.error(err);
    }
  };

  const createNotification = async (notification: Omit<Notification, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      return await NotificationService.createNotification(notification);
    } catch (err) {
      setError('Failed to create notification');
      console.error(err);
      throw err;
    }
  };

  const requestPushPermission = async () => {
    try {
      await PushNotificationService.initialize();
    } catch (err) {
      setError('Failed to request push notification permission');
      console.error(err);
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        error,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        createNotification,
        requestPushPermission
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  
  return context;
}; 
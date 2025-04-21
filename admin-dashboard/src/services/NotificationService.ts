import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  onSnapshot, 
  Timestamp,
  getDocs,
  orderBy,
  writeBatch,
  getDoc
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Notification } from '../types';
import { PushNotificationService } from './PushNotificationService';

/**
 * Service for managing notifications in the application
 */
export class NotificationService {
  /**
   * Create a new notification
   * @param notification Data for the new notification
   * @returns The ID of the created notification
   */
  static async createNotification(notification: Omit<Notification, 'id' | 'createdAt' | 'updatedAt'>) {
    try {
      const notificationData = {
        ...notification,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        read: false
      };

      const docRef = await addDoc(collection(db, 'notifications'), notificationData);
      
      // Send push notification if possible
      await this.sendPushNotification(notification.userId, {
        title: notification.title,
        body: notification.message,
        tag: docRef.id,
        data: {
          notificationId: docRef.id,
          type: notification.type
        }
      });
      
      return docRef.id;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  /**
   * Send notification to multiple users
   * @param userIds Array of user IDs to send notification to
   * @param notification Notification data
   * @returns Array of created notification IDs
   */
  static async sendToUsers(userIds: string[], notification: Omit<Notification, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) {
    try {
      const batch = writeBatch(db);
      const notificationsCollection = collection(db, 'notifications');
      const notificationIds: string[] = [];
      
      for (const userId of userIds) {
        const notificationData = {
          ...notification,
          userId,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
          read: false
        };
        
        const newDocRef = doc(notificationsCollection);
        batch.set(newDocRef, notificationData);
        notificationIds.push(newDocRef.id);
        
        // Send push notification
        await this.sendPushNotification(userId, {
          title: notification.title,
          body: notification.message,
          tag: newDocRef.id,
          data: {
            notificationId: newDocRef.id,
            type: notification.type
          }
        });
      }
      
      await batch.commit();
      return notificationIds;
    } catch (error) {
      console.error('Error sending notifications to users:', error);
      throw error;
    }
  }

  /**
   * Send notification to users by role
   * @param role User role to target ('admin', 'manager', or 'employee')
   * @param notification Notification data
   */
  static async sendToUsersByRole(role: 'admin' | 'manager' | 'employee', notification: Omit<Notification, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) {
    try {
      // First get all users with the specified role
      const usersQuery = query(collection(db, 'users'), where('role', '==', role));
      const usersSnapshot = await getDocs(usersQuery);
      
      const userIds = usersSnapshot.docs.map(doc => doc.id);
      
      // Send notification to all users with the specified role
      return this.sendToUsers(userIds, notification);
    } catch (error) {
      console.error(`Error sending notifications to ${role}s:`, error);
      throw error;
    }
  }

  /**
   * Send notification to users in a specific department
   * @param department Department name
   * @param notification Notification data
   */
  static async sendToUsersByDepartment(department: string, notification: Omit<Notification, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) {
    try {
      // First get all users in the specified department
      const usersQuery = query(collection(db, 'users'), where('department', '==', department));
      const usersSnapshot = await getDocs(usersQuery);
      
      const userIds = usersSnapshot.docs.map(doc => doc.id);
      
      // Send notification to all users in the department
      return this.sendToUsers(userIds, notification);
    } catch (error) {
      console.error(`Error sending notifications to ${department} department:`, error);
      throw error;
    }
  }

  /**
   * Send notification to all users
   * @param notification Notification data
   */
  static async sendToAll(notification: Omit<Notification, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) {
    try {
      // Get all users
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const userIds = usersSnapshot.docs.map(doc => doc.id);
      
      // Send notification to all users
      return this.sendToUsers(userIds, notification);
    } catch (error) {
      console.error('Error sending notifications to all users:', error);
      throw error;
    }
  }

  /**
   * Get all notifications for a specific user
   * @param userId The user ID
   * @param callback Function to call with updated notifications
   * @returns Unsubscribe function
   */
  static getNotificationsForUser(userId: string, callback: (notifications: Notification[]) => void) {
    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notificationsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Notification[];
      callback(notificationsData);
    });

    return unsubscribe;
  }

  /**
   * Get unread notifications count for a user
   * @param userId The user ID
   * @returns Promise with the count of unread notifications
   */
  static async getUnreadCount(userId: string): Promise<number> {
    try {
      const q = query(
        collection(db, 'notifications'),
        where('userId', '==', userId),
        where('read', '==', false)
      );
      
      const snapshot = await getDocs(q);
      return snapshot.size;
    } catch (error) {
      console.error('Error getting unread notifications count:', error);
      return 0;
    }
  }

  /**
   * Mark a notification as read
   * @param notificationId The notification ID
   */
  static async markAsRead(notificationId: string) {
    try {
      await updateDoc(doc(db, 'notifications', notificationId), {
        read: true,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  /**
   * Mark all notifications as read for a user
   * @param userId The user ID
   */
  static async markAllAsRead(userId: string) {
    try {
      const q = query(
        collection(db, 'notifications'),
        where('userId', '==', userId),
        where('read', '==', false)
      );
      
      const snapshot = await getDocs(q);
      
      const batch = snapshot.docs.map(doc => 
        updateDoc(doc.ref, {
          read: true,
          updatedAt: Timestamp.now()
        })
      );
      
      await Promise.all(batch);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }

  /**
   * Delete a notification
   * @param notificationId The notification ID
   */
  static async deleteNotification(notificationId: string) {
    try {
      await deleteDoc(doc(db, 'notifications', notificationId));
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  }
  
  /**
   * Send a push notification to a user
   * @param userId The user ID to send notification to
   * @param notification Notification data for push notification
   */
  private static async sendPushNotification(
    userId: string, 
    notification: { 
      title: string; 
      body: string; 
      tag?: string;
      data?: Record<string, any>; 
    }
  ) {
    try {
      // Get the user's FCM token from Firestore
      const userDoc = await getDoc(doc(db, 'users', userId));
      
      if (!userDoc.exists()) {
        console.log(`User ${userId} does not exist`);
        return;
      }
      
      const userData = userDoc.data();
      const fcmToken = userData.fcmToken;
      
      if (!fcmToken) {
        console.log(`User ${userId} does not have an FCM token`);
        return;
      }
      
      // Send the push notification via Firebase Admin SDK (server-side)
      // Note: In a real implementation, you would call a server endpoint
      // that has access to the Firebase Admin SDK
      console.log(`Sending push notification to user ${userId} with token ${fcmToken}`);
      
      // For demo purposes, we're logging that we would send the notification
      // In a real implementation, this would be handled by backend code
      console.log('Push notification content:', notification);
    } catch (error) {
      console.error('Error sending push notification:', error);
    }
  }
}

export default NotificationService; 
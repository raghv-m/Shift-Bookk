import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { getAuth } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import app from '../config/firebase';

// Your web app's Firebase configuration
// This should match the vapid key generated in Firebase console
const VAPID_KEY = process.env.REACT_APP_FIREBASE_VAPID_KEY;

/**
 * Service for managing push notifications using Firebase Cloud Messaging
 */
export class PushNotificationService {
  private static messaging = getMessaging(app);
  private static _fcmToken: string | null = null;
  
  /**
   * Initialize push notifications
   * @returns Promise that resolves when initialization is complete
   */
  static async initialize(): Promise<void> {
    try {
      // Request permission
      const permission = await Notification.requestPermission();
      
      if (permission === 'granted') {
        console.log('Notification permission granted.');
        
        // Get FCM token
        await this.getFCMToken();
        
        // Set up message listener
        this.setupMessageListener();
      } else {
        console.log('Unable to get permission to notify.');
      }
    } catch (error) {
      console.error('Error initializing push notifications:', error);
    }
  }
  
  /**
   * Get FCM token for the current user
   * @returns Promise with the FCM token or null if not available
   */
  static async getFCMToken(): Promise<string | null> {
    try {
      if (!VAPID_KEY) {
        console.error('VAPID_KEY is not defined in environment variables');
        return null;
      }
      
      const currentToken = await getToken(this.messaging, { 
        vapidKey: VAPID_KEY 
      });
      
      if (currentToken) {
        console.log('FCM token:', currentToken);
        this._fcmToken = currentToken;
        
        // Save the token to user's document in Firestore
        const auth = getAuth();
        const user = auth.currentUser;
        
        if (user) {
          await updateDoc(doc(db, 'users', user.uid), {
            fcmToken: currentToken
          });
        }
        
        return currentToken;
      } else {
        console.log('No registration token available.');
        return null;
      }
    } catch (error) {
      console.error('Error getting FCM token:', error);
      return null;
    }
  }
  
  /**
   * Set up listener for FCM messages when app is in foreground
   */
  static setupMessageListener(): void {
    onMessage(this.messaging, (payload) => {
      console.log('Message received in foreground:', payload);
      
      // Display notification using the Notification API
      if (payload.notification) {
        const { title, body } = payload.notification;
        
        new Notification(title as string, {
          body: body as string,
          icon: '/logo192.png'
        });
      }
    });
  }
  
  /**
   * Get the current FCM token
   * @returns The current FCM token or null
   */
  static get fcmToken(): string | null {
    return this._fcmToken;
  }
}

export default PushNotificationService; 
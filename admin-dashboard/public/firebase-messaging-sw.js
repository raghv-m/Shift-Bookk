// Import and configure the Firebase SDK
importScripts('https://www.gstatic.com/firebasejs/9.22.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.2/firebase-messaging-compat.js');

// Your web app's Firebase configuration
// Note: In production, you should consider using environment variables
firebase.initializeApp({
  apiKey: "YOUR_API_KEY",
  authDomain: "shift-bookk.firebaseapp.com",
  projectId: "shift-bookk",
  storageBucket: "shift-bookk.firebasestorage.app",
  messagingSenderId: "718786358148",
  appId: "1:718786358148:web:37c93b5e2d1270955ccbd1"
});

// Retrieve an instance of Firebase Messaging
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  
  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/logo192.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Service worker lifecycle events
self.addEventListener('install', event => {
  console.log('Service Worker installing.');
});

self.addEventListener('activate', event => {
  console.log('Service Worker activating.');
});

// Service worker fetch handler
self.addEventListener('fetch', event => {
  // You can implement custom fetch handling here if needed
}); 
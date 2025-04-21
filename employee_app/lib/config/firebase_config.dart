import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/foundation.dart' show kIsWeb;

class FirebaseConfig {
  static Future<void> initializeFirebase() async {
    if (kIsWeb) {
      await Firebase.initializeApp(
        options: const FirebaseOptions(
          apiKey: "AIzaSyDqUZMVGmcjMD6Zw8FzJ4g5eEaQHXxFWPY",
          authDomain: "shift-bookk.firebaseapp.com",
          projectId: "shift-bookk",
          storageBucket: "shift-bookk.appspot.com",
          messagingSenderId: "1234567890",
          appId: "1:1234567890:web:abcdef0123456789",
        ),
      );
    } else {
      await Firebase.initializeApp();
    }
  }
} 
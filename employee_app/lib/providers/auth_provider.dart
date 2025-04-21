import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'package:cloud_firestore/cloud_firestore.dart';

class AuthProvider with ChangeNotifier {
  final FirebaseAuth _auth = FirebaseAuth.instance;
  final GoogleSignIn _googleSignIn = GoogleSignIn();
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;
  User? _user;
  Map<String, dynamic>? _userData;

  User? get user => _user;
  Map<String, dynamic>? get userData => _userData;
  bool get isAuthenticated => _user != null;

  AuthProvider() {
    _auth.authStateChanges().listen((User? user) async {
      _user = user;
      if (user != null) {
        await _fetchUserData();
      } else {
        _userData = null;
      }
      notifyListeners();
    });
  }

  Future<void> _fetchUserData() async {
    try {
      final doc = await _firestore.collection('users').doc(_user!.uid).get();
      if (doc.exists) {
        _userData = doc.data();
        notifyListeners();
      }
    } catch (e) {
      debugPrint('Error fetching user data: $e');
    }
  }

  Future<void> signUp({
    required String email,
    required String password,
    required String displayName,
    required String phoneNumber,
    String? department,
    String role = 'employee',
  }) async {
    try {
      final UserCredential userCredential = await _auth.createUserWithEmailAndPassword(
        email: email,
        password: password,
      );

      await userCredential.user?.updateDisplayName(displayName);

      // Store additional user data in Firestore
      await _firestore.collection('users').doc(userCredential.user!.uid).set({
        'email': email,
        'displayName': displayName,
        'phoneNumber': phoneNumber,
        'department': department,
        'role': role,
        'createdAt': FieldValue.serverTimestamp(),
        'lastLogin': FieldValue.serverTimestamp(),
        'status': 'active',
      });

      await _fetchUserData();
    } catch (e) {
      debugPrint('Error signing up: $e');
      rethrow;
    }
  }

  Future<void> signInWithEmailAndPassword({
    required String email,
    required String password,
  }) async {
    try {
      await _auth.signInWithEmailAndPassword(
        email: email,
        password: password,
      );

      // Update last login timestamp
      if (_user != null) {
        await _firestore.collection('users').doc(_user!.uid).update({
          'lastLogin': FieldValue.serverTimestamp(),
        });
      }
    } catch (e) {
      debugPrint('Error signing in with email/password: $e');
      rethrow;
    }
  }

  Future<void> signInWithGoogle() async {
    try {
      final GoogleSignInAccount? googleUser = await _googleSignIn.signIn();
      if (googleUser == null) return;

      final GoogleSignInAuthentication googleAuth = await googleUser.authentication;
      final credential = GoogleAuthProvider.credential(
        accessToken: googleAuth.accessToken,
        idToken: googleAuth.idToken,
      );

      final UserCredential userCredential = await _auth.signInWithCredential(credential);

      // Check if this is the first time signing in with Google
      final userDoc = await _firestore.collection('users').doc(userCredential.user!.uid).get();
      
      if (!userDoc.exists) {
        // Create new user document for first-time Google sign-in
        await _firestore.collection('users').doc(userCredential.user!.uid).set({
          'email': userCredential.user!.email,
          'displayName': userCredential.user!.displayName,
          'photoURL': userCredential.user!.photoURL,
          'role': 'employee',
          'createdAt': FieldValue.serverTimestamp(),
          'lastLogin': FieldValue.serverTimestamp(),
          'status': 'active',
        });
      } else {
        // Update last login for existing users
        await _firestore.collection('users').doc(userCredential.user!.uid).update({
          'lastLogin': FieldValue.serverTimestamp(),
        });
      }

      await _fetchUserData();
    } catch (e) {
      debugPrint('Error signing in with Google: $e');
      rethrow;
    }
  }

  Future<void> signOut() async {
    try {
      await _googleSignIn.signOut();
      await _auth.signOut();
      _userData = null;
    } catch (e) {
      debugPrint('Error signing out: $e');
      rethrow;
    }
  }

  Future<void> updateUserProfile({
    String? displayName,
    String? phoneNumber,
    String? department,
  }) async {
    try {
      if (_user == null) throw Exception('No user logged in');

      final updates = <String, dynamic>{};
      if (displayName != null) {
        updates['displayName'] = displayName;
        await _user!.updateDisplayName(displayName);
      }
      if (phoneNumber != null) updates['phoneNumber'] = phoneNumber;
      if (department != null) updates['department'] = department;

      if (updates.isNotEmpty) {
        await _firestore.collection('users').doc(_user!.uid).update(updates);
        await _fetchUserData();
      }
    } catch (e) {
      debugPrint('Error updating user profile: $e');
      rethrow;
    }
  }
} 
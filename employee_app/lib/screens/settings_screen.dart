import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart' as firebase_auth;

class SettingsScreen extends StatelessWidget {
  const SettingsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final user = firebase_auth.FirebaseAuth.instance.currentUser;
    final firestore = FirebaseFirestore.instance;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Settings'),
      ),
      body: StreamBuilder<DocumentSnapshot>(
        stream: firestore.collection('users').doc(user?.uid).snapshots(),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }

          if (!snapshot.hasData || !snapshot.data!.exists) {
            return const Center(child: Text('User data not found'));
          }

          final userData = snapshot.data!.data() as Map<String, dynamic>;
          final notificationsEnabled = userData['notificationsEnabled'] ?? true;

          return ListView(
            padding: const EdgeInsets.all(16),
            children: [
              ListTile(
                leading: const Icon(Icons.person_outline),
                title: const Text('Account'),
                subtitle: Text(
                  user?.email ?? 'No email',
                  style: GoogleFonts.poppins(
                    color: Theme.of(context).colorScheme.onSurface.withOpacity(0.7),
                  ),
                ),
                onTap: () {
                  showDialog(
                    context: context,
                    builder: (context) => AlertDialog(
                      title: const Text('Account Settings'),
                      content: Column(
                        mainAxisSize: MainAxisSize.min,
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('Email: ${user?.email}'),
                          const SizedBox(height: 8),
                          Text('Name: ${userData['name'] ?? 'Not set'}'),
                          const SizedBox(height: 8),
                          Text('Role: ${userData['role'] ?? 'Employee'}'),
                        ],
                      ),
                      actions: [
                        TextButton(
                          onPressed: () => Navigator.pop(context),
                          child: const Text('Close'),
                        ),
                      ],
                    ),
                  );
                },
              ),
              const Divider(),
              ListTile(
                leading: const Icon(Icons.notifications_outlined),
                title: const Text('Notifications'),
                trailing: Switch(
                  value: notificationsEnabled,
                  onChanged: (value) {
                    firestore.collection('users').doc(user?.uid).update({
                      'notificationsEnabled': value,
                    });
                  },
                ),
                onTap: () {
                  showDialog(
                    context: context,
                    builder: (context) => AlertDialog(
                      title: const Text('Notification Settings'),
                      content: Column(
                        mainAxisSize: MainAxisSize.min,
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text('Push Notifications'),
                          const SizedBox(height: 8),
                          Text(
                            'Receive notifications for:',
                            style: GoogleFonts.poppins(
                              color: Theme.of(context).colorScheme.onSurface.withOpacity(0.7),
                            ),
                          ),
                          const SizedBox(height: 8),
                          _NotificationOption(
                            title: 'Shift Changes',
                            value: userData['shiftNotifications'] ?? true,
                            onChanged: (value) {
                              firestore.collection('users').doc(user?.uid).update({
                                'shiftNotifications': value,
                              });
                            },
                          ),
                          _NotificationOption(
                            title: 'Time Off Requests',
                            value: userData['timeOffNotifications'] ?? true,
                            onChanged: (value) {
                              firestore.collection('users').doc(user?.uid).update({
                                'timeOffNotifications': value,
                              });
                            },
                          ),
                          _NotificationOption(
                            title: 'Messages',
                            value: userData['messageNotifications'] ?? true,
                            onChanged: (value) {
                              firestore.collection('users').doc(user?.uid).update({
                                'messageNotifications': value,
                              });
                            },
                          ),
                        ],
                      ),
                      actions: [
                        TextButton(
                          onPressed: () => Navigator.pop(context),
                          child: const Text('Close'),
                        ),
                      ],
                    ),
                  );
                },
              ),
              const Divider(),
              ListTile(
                leading: const Icon(Icons.logout),
                title: const Text('Sign Out'),
                onTap: () {
                  Provider.of<AuthProvider>(context, listen: false).signOut();
                  Navigator.of(context).pushReplacementNamed('/login');
                },
              ),
            ],
          );
        },
      ),
    );
  }
}

class _NotificationOption extends StatelessWidget {
  final String title;
  final bool value;
  final ValueChanged<bool> onChanged;

  const _NotificationOption({
    required this.title,
    required this.value,
    required this.onChanged,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(title),
        Switch(
          value: value,
          onChanged: onChanged,
        ),
      ],
    );
  }
} 
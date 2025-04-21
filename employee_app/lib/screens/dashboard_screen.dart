import 'dart:async';
import '../models/shift.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../providers/shift_provider.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart' as firebase_auth;

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  late StreamSubscription<QuerySnapshot> _shiftsSubscription;
  final _firestore = FirebaseFirestore.instance;
  final _auth = firebase_auth.FirebaseAuth.instance;

  @override
  void initState() {
    super.initState();
    _initializeShifts();
  }

  void _initializeShifts() {
    final userId = _auth.currentUser?.uid;
    if (userId != null) {
      _shiftsSubscription = _firestore
          .collection('shifts')
          .where('userId', isEqualTo: userId)
          .orderBy('startTime', descending: true)
          .snapshots()
          .listen(
            (snapshot) {
              final shifts = snapshot.docs.map((doc) {
                final data = doc.data() as Map<String, dynamic>;
                return Shift.fromMap({...data, 'id': doc.id});
              }).toList();
              context.read<ShiftProvider>().setShifts(shifts);
            },
            onError: (error) {
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text('Error loading shifts: ${error.toString()}'),
                  backgroundColor: Colors.red,
                ),
              );
            },
          );
    }
  }

  @override
  void dispose() {
    _shiftsSubscription.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: CustomScrollView(
        slivers: [
          _buildAppBar(),
          _buildQuickActions(),
          _buildUpcomingShifts(),
        ],
      ),
    );
  }

  SliverAppBar _buildAppBar() {
    return SliverAppBar(
      expandedHeight: 200.0,
      floating: false,
      pinned: true,
      flexibleSpace: FlexibleSpaceBar(
        title: Text(
          _getGreeting(),
          style: GoogleFonts.poppins(
            color: Colors.white,
            fontSize: 24,
            fontWeight: FontWeight.bold,
          ),
        ),
        background: Container(
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [
                Theme.of(context).primaryColor,
                Theme.of(context).primaryColor.withOpacity(0.8),
              ],
            ),
          ),
        ),
      ),
    );
  }

  String _getGreeting() {
    final hour = DateTime.now().hour;
    if (hour < 12) {
      return 'Good Morning';
    } else if (hour < 17) {
      return 'Good Afternoon';
    } else {
      return 'Good Evening';
    }
  }

  SliverToBoxAdapter _buildQuickActions() {
    return SliverToBoxAdapter(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Row(
          children: [
            Expanded(
              child: _QuickActionCard(
                icon: Icons.calendar_today,
                title: 'Request Time Off',
                onTap: () {
                  Navigator.pushNamed(context, '/time-off-request');
                },
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: _QuickActionCard(
                icon: Icons.schedule,
                title: 'View Schedule',
                onTap: () {
                  Navigator.pushNamed(context, '/schedule');
                },
              ),
            ),
          ],
        ),
      ),
    );
  }

  SliverToBoxAdapter _buildUpcomingShifts() {
    return SliverToBoxAdapter(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Upcoming Shifts',
              style: GoogleFonts.poppins(
                fontSize: 20,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 16),
            Consumer<ShiftProvider>(
              builder: (context, shiftProvider, child) {
                if (shiftProvider.isLoading) {
                  return const Center(child: CircularProgressIndicator());
                }

                if (shiftProvider.error != null) {
                  return Center(
                    child: Text(
                      shiftProvider.error!,
                      style: const TextStyle(color: Colors.red),
                    ),
                  );
                }

                final shifts = shiftProvider.shifts;
                if (shifts.isEmpty) {
                  return const Center(
                    child: Text('No upcoming shifts'),
                  );
                }

                return ListView.builder(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  itemCount: shifts.length,
                  itemBuilder: (context, index) {
                    final shift = shifts[index];
                    return _ShiftCard(shift: shift);
                  },
                );
              },
            ),
          ],
        ),
      ),
    );
  }
}

class _QuickActionCard extends StatelessWidget {
  final IconData icon;
  final String title;
  final VoidCallback onTap;

  const _QuickActionCard({
    required this.icon,
    required this.title,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 4,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            children: [
              Icon(
                icon,
                size: 32,
                color: Theme.of(context).primaryColor,
              ),
              const SizedBox(height: 8),
              Text(
                title,
                style: GoogleFonts.poppins(
                  fontSize: 16,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _ShiftCard extends StatelessWidget {
  final Shift shift;

  const _ShiftCard({required this.shift});

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  shift.title,
                  style: GoogleFonts.poppins(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                Text(
                  shift.status.toString().split('.').last,
                  style: TextStyle(
                    color: _getStatusColor(shift.status),
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),
            Text(
              '${_formatDateTime(shift.startTime)} - ${_formatDateTime(shift.endTime)}',
              style: GoogleFonts.poppins(
                fontSize: 16,
                color: Colors.grey[600],
              ),
            ),
            const SizedBox(height: 16),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                _buildActionButton(
                  context,
                  'Clock In',
                  Icons.login,
                  shift.status == ShiftStatus.scheduled,
                  () => context.read<ShiftProvider>().clockIn(shift),
                ),
                _buildActionButton(
                  context,
                  'Start Break',
                  Icons.coffee,
                  shift.status == ShiftStatus.inProgress,
                  () => context.read<ShiftProvider>().startBreak(shift),
                ),
                _buildActionButton(
                  context,
                  'Clock Out',
                  Icons.logout,
                  shift.status == ShiftStatus.inProgress,
                  () => context.read<ShiftProvider>().clockOut(shift),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Color _getStatusColor(ShiftStatus status) {
    switch (status) {
      case ShiftStatus.scheduled:
        return Colors.blue;
      case ShiftStatus.inProgress:
        return Colors.green;
      case ShiftStatus.completed:
        return Colors.grey;
      case ShiftStatus.cancelled:
        return Colors.red;
    }
  }

  String _formatDateTime(DateTime dateTime) {
    return '${dateTime.hour.toString().padLeft(2, '0')}:${dateTime.minute.toString().padLeft(2, '0')}';
  }

  Widget _buildActionButton(
    BuildContext context,
    String label,
    IconData icon,
    bool enabled,
    VoidCallback onPressed,
  ) {
    return ElevatedButton.icon(
      onPressed: enabled ? onPressed : null,
      icon: Icon(icon),
      label: Text(label),
      style: ElevatedButton.styleFrom(
        backgroundColor: enabled ? Theme.of(context).primaryColor : Colors.grey,
        foregroundColor: Colors.white,
      ),
    );
  }
} 
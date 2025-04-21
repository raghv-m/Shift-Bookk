import 'dart:async';
import '../models/shift.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/shift_provider.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:table_calendar/table_calendar.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart' as firebase_auth;

class ScheduleScreen extends StatefulWidget {
  const ScheduleScreen({super.key});

  @override
  State<ScheduleScreen> createState() => _ScheduleScreenState();
}

class _ScheduleScreenState extends State<ScheduleScreen> {
  final _firestore = FirebaseFirestore.instance;
  final _auth = firebase_auth.FirebaseAuth.instance;
  late StreamSubscription<QuerySnapshot> _shiftsSubscription;
  
  DateTime _focusedDay = DateTime.now();
  DateTime? _selectedDay;
  CalendarFormat _calendarFormat = CalendarFormat.week;

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
      appBar: AppBar(
        title: Text(
          'Schedule',
          style: GoogleFonts.poppins(),
        ),
      ),
      body: Column(
        children: [
          TableCalendar(
            firstDay: DateTime.utc(2024, 1, 1),
            lastDay: DateTime.utc(2024, 12, 31),
            focusedDay: _focusedDay,
            selectedDayPredicate: (day) => isSameDay(_selectedDay, day),
            calendarFormat: _calendarFormat,
            onFormatChanged: (format) {
              setState(() {
                _calendarFormat = format;
              });
            },
            onDaySelected: (selectedDay, focusedDay) {
              setState(() {
                _selectedDay = selectedDay;
                _focusedDay = focusedDay;
              });
            },
            calendarStyle: CalendarStyle(
              selectedDecoration: BoxDecoration(
                color: Theme.of(context).primaryColor,
                shape: BoxShape.circle,
              ),
              todayDecoration: BoxDecoration(
                color: Theme.of(context).primaryColor.withOpacity(0.5),
                shape: BoxShape.circle,
              ),
            ),
          ),
          Expanded(
            child: Consumer<ShiftProvider>(
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

                final shifts = shiftProvider.shifts.where((shift) {
                  if (_selectedDay == null) return true;
                  return isSameDay(shift.startTime, _selectedDay!);
                }).toList();

                if (shifts.isEmpty) {
                  return const Center(
                    child: Text('No shifts scheduled'),
                  );
                }

                return ListView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: shifts.length,
                  itemBuilder: (context, index) {
                    final shift = shifts[index];
                    return Card(
                      margin: const EdgeInsets.only(bottom: 16),
                      child: ListTile(
                        title: Text(
                          shift.title,
                          style: GoogleFonts.poppins(
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        subtitle: Text(
                          '${_formatTime(shift.startTime)} - ${_formatTime(shift.endTime)}',
                          style: GoogleFonts.poppins(),
                        ),
                        trailing: Text(
                          shift.status.toString().split('.').last,
                          style: TextStyle(
                            color: _getStatusColor(shift.status),
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    );
                  },
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  String _formatTime(DateTime dateTime) {
    return '${dateTime.hour.toString().padLeft(2, '0')}:${dateTime.minute.toString().padLeft(2, '0')}';
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
} 
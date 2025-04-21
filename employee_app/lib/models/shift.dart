import 'package:cloud_firestore/cloud_firestore.dart';

enum ShiftStatus {
  scheduled,
  inProgress,
  completed,
  cancelled,
}

class Shift {
  final String id;
  final String userId;
  final String title;
  final DateTime startTime;
  final DateTime endTime;
  final ShiftStatus status;
  final DateTime? clockInTime;
  final DateTime? clockOutTime;
  final List<TimeLog> timeLogs;

  Shift({
    required this.id,
    required this.userId,
    required this.title,
    required this.startTime,
    required this.endTime,
    required this.status,
    this.clockInTime,
    this.clockOutTime,
    this.timeLogs = const [],
  });

  factory Shift.fromMap(Map<String, dynamic> map) {
    return Shift(
      id: map['id'] as String,
      userId: map['userId'] as String,
      title: map['title'] as String,
      startTime: (map['startTime'] as Timestamp).toDate(),
      endTime: (map['endTime'] as Timestamp).toDate(),
      status: ShiftStatus.values.firstWhere(
        (e) => e.toString() == 'ShiftStatus.${map['status']}',
      ),
      clockInTime: map['clockInTime'] != null
          ? (map['clockInTime'] as Timestamp).toDate()
          : null,
      clockOutTime: map['clockOutTime'] != null
          ? (map['clockOutTime'] as Timestamp).toDate()
          : null,
      timeLogs: (map['timeLogs'] as List<dynamic>?)
              ?.map((log) => TimeLog.fromMap(log as Map<String, dynamic>))
              .toList() ??
          [],
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'userId': userId,
      'title': title,
      'startTime': Timestamp.fromDate(startTime),
      'endTime': Timestamp.fromDate(endTime),
      'status': status.toString().split('.').last,
      'clockInTime': clockInTime != null ? Timestamp.fromDate(clockInTime!) : null,
      'clockOutTime': clockOutTime != null ? Timestamp.fromDate(clockOutTime!) : null,
      'timeLogs': timeLogs.map((log) => log.toMap()).toList(),
    };
  }
}

class TimeLog {
  final String id;
  final String type;
  final DateTime startTime;
  final DateTime? endTime;

  TimeLog({
    required this.id,
    required this.type,
    required this.startTime,
    this.endTime,
  });

  factory TimeLog.fromMap(Map<String, dynamic> map) {
    return TimeLog(
      id: map['id'] as String,
      type: map['type'] as String,
      startTime: (map['startTime'] as Timestamp).toDate(),
      endTime: map['endTime'] != null
          ? (map['endTime'] as Timestamp).toDate()
          : null,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'type': type,
      'startTime': Timestamp.fromDate(startTime),
      'endTime': endTime != null ? Timestamp.fromDate(endTime!) : null,
    };
  }
} 
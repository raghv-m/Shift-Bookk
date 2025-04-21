import '../models/shift.dart';
import 'package:flutter/foundation.dart';
import 'package:cloud_firestore/cloud_firestore.dart';

class ShiftProvider with ChangeNotifier {
  List<Shift> _shifts = [];
  bool _isLoading = false;
  String? _error;

  List<Shift> get shifts => _shifts;
  bool get isLoading => _isLoading;
  String? get error => _error;

  final FirebaseFirestore _firestore = FirebaseFirestore.instance;

  void setShifts(List<Shift> shifts) {
    _shifts = shifts;
    notifyListeners();
  }

  Future<void> fetchShifts(String userId) async {
    try {
      _isLoading = true;
      _error = null;
      notifyListeners();

      final snapshot = await _firestore
          .collection('shifts')
          .where('userId', isEqualTo: userId)
          .orderBy('startTime', descending: true)
          .get();

      _shifts = snapshot.docs
          .map((doc) => Shift.fromMap({...doc.data(), 'id': doc.id}))
          .toList();
    } catch (e) {
      _error = 'Failed to fetch shifts: ${e.toString()}';
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> addShift(Shift shift) async {
    try {
      _isLoading = true;
      _error = null;
      notifyListeners();

      final docRef = await _firestore.collection('shifts').add(shift.toMap());
      final newShift = Shift.fromMap({...shift.toMap(), 'id': docRef.id});
      _shifts = [newShift, ..._shifts];
    } catch (e) {
      _error = 'Failed to add shift: ${e.toString()}';
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> updateShift(Shift shift) async {
    try {
      _isLoading = true;
      _error = null;
      notifyListeners();

      await _firestore.collection('shifts').doc(shift.id).update(shift.toMap());
      final index = _shifts.indexWhere((s) => s.id == shift.id);
      if (index != -1) {
        _shifts[index] = shift;
      }
    } catch (e) {
      _error = 'Failed to update shift: ${e.toString()}';
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> deleteShift(String shiftId) async {
    try {
      _isLoading = true;
      _error = null;
      notifyListeners();

      await _firestore.collection('shifts').doc(shiftId).delete();
      _shifts.removeWhere((shift) => shift.id == shiftId);
    } catch (e) {
      _error = 'Failed to delete shift: ${e.toString()}';
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> clockIn(Shift shift) async {
    try {
      final updatedShift = Shift(
        id: shift.id,
        userId: shift.userId,
        title: shift.title,
        startTime: shift.startTime,
        endTime: shift.endTime,
        status: ShiftStatus.inProgress,
        clockInTime: DateTime.now(),
        clockOutTime: shift.clockOutTime,
        timeLogs: shift.timeLogs,
      );

      await updateShift(updatedShift);
    } catch (e) {
      _error = 'Failed to clock in: ${e.toString()}';
      notifyListeners();
    }
  }

  Future<void> clockOut(Shift shift) async {
    try {
      final updatedShift = Shift(
        id: shift.id,
        userId: shift.userId,
        title: shift.title,
        startTime: shift.startTime,
        endTime: shift.endTime,
        status: ShiftStatus.completed,
        clockInTime: shift.clockInTime,
        clockOutTime: DateTime.now(),
        timeLogs: shift.timeLogs,
      );

      await updateShift(updatedShift);
    } catch (e) {
      _error = 'Failed to clock out: ${e.toString()}';
      notifyListeners();
    }
  }

  Future<void> startBreak(Shift shift) async {
    try {
      final timeLog = TimeLog(
        id: DateTime.now().millisecondsSinceEpoch.toString(),
        type: 'break',
        startTime: DateTime.now(),
      );

      final updatedTimeLogs = [...shift.timeLogs, timeLog];
      final updatedShift = Shift(
        id: shift.id,
        userId: shift.userId,
        title: shift.title,
        startTime: shift.startTime,
        endTime: shift.endTime,
        status: shift.status,
        clockInTime: shift.clockInTime,
        clockOutTime: shift.clockOutTime,
        timeLogs: updatedTimeLogs,
      );

      await updateShift(updatedShift);
    } catch (e) {
      _error = 'Failed to start break: ${e.toString()}';
      notifyListeners();
    }
  }

  Future<void> endBreak(Shift shift) async {
    try {
      final lastBreak = shift.timeLogs.lastWhere(
        (log) => log.type == 'break' && log.endTime == null,
      );

      final updatedTimeLogs = shift.timeLogs.map((log) {
        if (log.id == lastBreak.id) {
          return TimeLog(
            id: log.id,
            type: log.type,
            startTime: log.startTime,
            endTime: DateTime.now(),
          );
        }
        return log;
      }).toList();

      final updatedShift = Shift(
        id: shift.id,
        userId: shift.userId,
        title: shift.title,
        startTime: shift.startTime,
        endTime: shift.endTime,
        status: shift.status,
        clockInTime: shift.clockInTime,
        clockOutTime: shift.clockOutTime,
        timeLogs: updatedTimeLogs,
      );

      await updateShift(updatedShift);
    } catch (e) {
      _error = 'Failed to end break: ${e.toString()}';
      notifyListeners();
    }
  }
} 
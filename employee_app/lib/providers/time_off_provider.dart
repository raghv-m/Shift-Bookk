import 'package:flutter/foundation.dart';
import 'package:cloud_firestore/cloud_firestore.dart';

class TimeOffRequest {
  final String id;
  final String userId;
  final DateTime startDate;
  final DateTime endDate;
  final String reason;
  final String status;
  final DateTime createdAt;

  TimeOffRequest({
    required this.id,
    required this.userId,
    required this.startDate,
    required this.endDate,
    required this.reason,
    required this.status,
    required this.createdAt,
  });

  factory TimeOffRequest.fromMap(Map<String, dynamic> map) {
    return TimeOffRequest(
      id: map['id'] as String,
      userId: map['userId'] as String,
      startDate: (map['startDate'] as Timestamp).toDate(),
      endDate: (map['endDate'] as Timestamp).toDate(),
      reason: map['reason'] as String,
      status: map['status'] as String,
      createdAt: (map['createdAt'] as Timestamp).toDate(),
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'userId': userId,
      'startDate': Timestamp.fromDate(startDate),
      'endDate': Timestamp.fromDate(endDate),
      'reason': reason,
      'status': status,
      'createdAt': Timestamp.fromDate(createdAt),
    };
  }
}

class TimeOffProvider with ChangeNotifier {
  List<TimeOffRequest> _requests = [];
  bool _isLoading = false;
  String? _error;

  List<TimeOffRequest> get requests => _requests;
  bool get isLoading => _isLoading;
  String? get error => _error;

  final FirebaseFirestore _firestore = FirebaseFirestore.instance;

  void setRequests(List<TimeOffRequest> requests) {
    _requests = requests;
    notifyListeners();
  }

  Future<void> fetchRequests(String userId) async {
    try {
      _isLoading = true;
      _error = null;
      notifyListeners();

      final snapshot = await _firestore
          .collection('time_off_requests')
          .where('userId', isEqualTo: userId)
          .orderBy('createdAt', descending: true)
          .get();

      _requests = snapshot.docs
          .map((doc) => TimeOffRequest.fromMap({...doc.data(), 'id': doc.id}))
          .toList();
    } catch (e) {
      _error = 'Failed to fetch time off requests: ${e.toString()}';
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> submitRequest(TimeOffRequest request) async {
    try {
      _isLoading = true;
      _error = null;
      notifyListeners();

      final docRef = await _firestore
          .collection('time_off_requests')
          .add(request.toMap());
      final newRequest =
          TimeOffRequest.fromMap({...request.toMap(), 'id': docRef.id});
      _requests = [newRequest, ..._requests];
    } catch (e) {
      _error = 'Failed to submit time off request: ${e.toString()}';
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> cancelRequest(String requestId) async {
    try {
      _isLoading = true;
      _error = null;
      notifyListeners();

      await _firestore
          .collection('time_off_requests')
          .doc(requestId)
          .update({'status': 'cancelled'});

      _requests = _requests.map((request) {
        if (request.id == requestId) {
          return TimeOffRequest(
            id: request.id,
            userId: request.userId,
            startDate: request.startDate,
            endDate: request.endDate,
            reason: request.reason,
            status: 'cancelled',
            createdAt: request.createdAt,
          );
        }
        return request;
      }).toList();
    } catch (e) {
      _error = 'Failed to cancel time off request: ${e.toString()}';
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
} 
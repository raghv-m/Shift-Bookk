import 'package:cloud_firestore/cloud_firestore.dart';

class ChatMessage {
  final String id;
  final String content;
  final String senderId;
  final DateTime timestamp;
  final String status;
  final String type;
  final String? name;
  final int? size;

  ChatMessage({
    required this.id,
    required this.content,
    required this.senderId,
    required this.timestamp,
    required this.status,
    required this.type,
    this.name,
    this.size,
  });

  factory ChatMessage.fromMap(Map<String, dynamic> map) {
    return ChatMessage(
      id: map['id'] as String,
      content: map['content'] as String,
      senderId: map['senderId'] as String,
      timestamp: (map['timestamp'] as Timestamp).toDate(),
      status: map['status'] as String,
      type: map['type'] as String,
      name: map['name'] as String?,
      size: map['size'] as int?,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'content': content,
      'senderId': senderId,
      'timestamp': timestamp,
      'status': status,
      'type': type,
      'name': name,
      'size': size,
    };
  }
} 
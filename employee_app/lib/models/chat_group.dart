class ChatGroup {
  final String id;
  final String name;
  final List<String> members;
  final String? lastMessage;
  final DateTime? lastMessageTime;

  ChatGroup({
    required this.id,
    required this.name,
    required this.members,
    this.lastMessage,
    this.lastMessageTime,
  });

  factory ChatGroup.fromMap(Map<String, dynamic> map) {
    return ChatGroup(
      id: map['id'] as String,
      name: map['name'] as String,
      members: List<String>.from(map['members'] as List),
      lastMessage: map['lastMessage'] as String?,
      lastMessageTime: map['lastMessageTime']?.toDate(),
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'name': name,
      'members': members,
      'lastMessage': lastMessage,
      'lastMessageTime': lastMessageTime,
    };
  }
} 
class User {
  final String id;
  final String name;
  final String email;
  final String? photoUrl;
  final List<String>? mutedGroups;

  User({
    required this.id,
    required this.name,
    required this.email,
    this.photoUrl,
    this.mutedGroups,
  });

  factory User.fromMap(Map<String, dynamic> map) {
    return User(
      id: map['id'] as String,
      name: map['name'] as String,
      email: map['email'] as String,
      photoUrl: map['photoUrl'] as String?,
      mutedGroups: map['mutedGroups'] != null
          ? List<String>.from(map['mutedGroups'] as List)
          : null,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'name': name,
      'email': email,
      'photoUrl': photoUrl,
      'mutedGroups': mutedGroups,
    };
  }
} 
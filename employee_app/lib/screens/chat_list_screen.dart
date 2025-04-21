import 'dart:async';
import 'chat_screen.dart';
import 'package:intl/intl.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:cached_network_image/cached_network_image.dart';

class ChatListScreen extends StatefulWidget {
  const ChatListScreen({Key? key}) : super(key: key);

  @override
  _ChatListScreenState createState() => _ChatListScreenState();
}

class _ChatListScreenState extends State<ChatListScreen> {
  final _firestore = FirebaseFirestore.instance;
  final _auth = FirebaseAuth.instance;
  List<Map<String, dynamic>> _groups = [];
  List<Map<String, dynamic>> _users = [];
  String _selectedTab = 'groups';
  bool _isLoading = true;
  String? _error;
  StreamSubscription? _groupsSubscription;
  StreamSubscription? _usersSubscription;

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  @override
  void dispose() {
    _groupsSubscription?.cancel();
    _usersSubscription?.cancel();
    super.dispose();
  }

  Future<void> _loadData() async {
    try {
      setState(() {
        _isLoading = true;
        _error = null;
      });

      final user = _auth.currentUser;
      if (user == null) throw Exception('User not authenticated');

      // Load groups
      _groupsSubscription = _firestore
          .collection('groups')
          .where('members', arrayContains: user.uid)
          .snapshots()
          .listen((snapshot) {
        setState(() {
          _groups = snapshot.docs.map((doc) {
            final data = doc.data();
            return {
              'id': doc.id,
              ...data,
              'lastMessage': data['lastMessage'] ?? '',
              'lastMessageTime': data['lastMessageTime']?.toDate(),
              'unreadCount': data['unreadCount']?[user.uid] ?? 0,
            };
          }).toList();
          _isLoading = false;
        });
      }, onError: (error) {
        setState(() {
          _error = error.toString();
          _isLoading = false;
        });
      });

      // Load users
      _usersSubscription = _firestore
          .collection('users')
          .where('storeId', isEqualTo: user.uid)
          .snapshots()
          .listen((snapshot) {
        setState(() {
          _users = snapshot.docs
              .map((doc) => {'id': doc.id, ...doc.data()})
              .where((userData) => userData['id'] != user.uid)
              .toList();
        });
      }, onError: (error) {
        setState(() {
          _error = error.toString();
          _isLoading = false;
        });
      });
    } catch (e) {
      setState(() {
        _error = e.toString();
        _isLoading = false;
      });
    }
  }

  String _formatLastMessageTime(DateTime? time) {
    if (time == null) return '';
    final now = DateTime.now();
    final difference = now.difference(time);

    if (difference.inDays > 7) {
      return DateFormat('MMM d, y').format(time);
    } else if (difference.inDays > 0) {
      return '${difference.inDays}d ago';
    } else if (difference.inHours > 0) {
      return '${difference.inHours}h ago';
    } else if (difference.inMinutes > 0) {
      return '${difference.inMinutes}m ago';
    } else {
      return 'Just now';
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return const Scaffold(
        body: Center(
          child: CircularProgressIndicator(),
        ),
      );
    }

    if (_error != null) {
      return Scaffold(
        appBar: AppBar(),
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(
                'Error',
                style: GoogleFonts.poppins(
                  fontSize: 24,
                  fontWeight: FontWeight.w600,
                ),
              ),
              const SizedBox(height: 16),
              Text(
                _error!,
                textAlign: TextAlign.center,
                style: GoogleFonts.poppins(
                  color: Colors.red,
                ),
              ),
              const SizedBox(height: 16),
              ElevatedButton(
                onPressed: _loadData,
                child: const Text('Retry'),
              ),
            ],
          ),
        ),
      );
    }

    return Scaffold(
      appBar: AppBar(
        title: Text(
          'Messages',
          style: GoogleFonts.poppins(
            fontWeight: FontWeight.w600,
          ),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.search),
            onPressed: () {
              // TODO: Implement search
            },
          ),
          IconButton(
            icon: const Icon(Icons.group_add),
            onPressed: () {
              // TODO: Implement create/join group
            },
          ),
        ],
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(48),
          child: Container(
            height: 48,
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Row(
              children: [
                _buildTabButton('Groups', 'groups'),
                _buildTabButton('Direct Messages', 'direct'),
              ],
            ),
          ),
        ),
      ),
      body: _selectedTab == 'groups' ? _buildGroupsList() : _buildUsersList(),
    );
  }

  Widget _buildTabButton(String label, String value) {
    final isSelected = _selectedTab == value;
    return Expanded(
      child: InkWell(
        onTap: () {
          setState(() {
            _selectedTab = value;
          });
        },
        child: Container(
          alignment: Alignment.center,
          decoration: BoxDecoration(
            border: Border(
              bottom: BorderSide(
                color: isSelected
                    ? Theme.of(context).primaryColor
                    : Colors.transparent,
                width: 2,
              ),
            ),
          ),
          child: Text(
            label,
            style: GoogleFonts.poppins(
              fontWeight: isSelected ? FontWeight.w600 : FontWeight.normal,
              color: isSelected
                  ? Theme.of(context).primaryColor
                  : Colors.grey[600],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildGroupsList() {
    if (_groups.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.group_outlined,
              size: 64,
              color: Colors.grey[400],
            ),
            const SizedBox(height: 16),
            Text(
              'No groups yet',
              style: GoogleFonts.poppins(
                fontSize: 16,
                color: Colors.grey[600],
              ),
            ),
            const SizedBox(height: 8),
            TextButton(
              onPressed: () {
                // TODO: Implement create group
              },
              child: const Text('Create a group'),
            ),
          ],
        ),
      );
    }

    return ListView.builder(
      itemCount: _groups.length,
      itemBuilder: (context, index) {
        final group = _groups[index];
        final unreadCount = group['unreadCount'] as int;
        final lastMessage = group['lastMessage'] as String;
        final lastMessageTime = group['lastMessageTime'] as DateTime?;

        return ListTile(
          leading: CircleAvatar(
            backgroundImage: group['imageUrl'] != null
                ? CachedNetworkImageProvider(group['imageUrl'])
                : null,
            child: group['imageUrl'] == null
                ? Text(group['name'][0].toUpperCase())
                : null,
          ),
          title: Text(
            group['name'],
            style: GoogleFonts.poppins(
              fontWeight: unreadCount > 0 ? FontWeight.w600 : FontWeight.normal,
            ),
          ),
          subtitle: Text(
            lastMessage,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
            style: GoogleFonts.poppins(
              color: unreadCount > 0
                  ? Theme.of(context).primaryColor
                  : Colors.grey[600],
            ),
          ),
          trailing: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text(
                _formatLastMessageTime(lastMessageTime),
                style: GoogleFonts.poppins(
                  fontSize: 12,
                  color: Colors.grey[600],
                ),
              ),
              if (unreadCount > 0)
                Container(
                  margin: const EdgeInsets.only(top: 4),
                  padding: const EdgeInsets.symmetric(
                    horizontal: 8,
                    vertical: 2,
                  ),
                  decoration: BoxDecoration(
                    color: Theme.of(context).primaryColor,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    unreadCount.toString(),
                    style: GoogleFonts.poppins(
                      fontSize: 12,
                      color: Colors.white,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
            ],
          ),
          onTap: () {
            Navigator.push(
              context,
              MaterialPageRoute(
                builder: (context) => ChatScreen(groupId: group['id']),
              ),
            );
          },
        );
      },
    );
  }

  Widget _buildUsersList() {
    if (_users.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.person_outline,
              size: 64,
              color: Colors.grey[400],
            ),
            const SizedBox(height: 16),
            Text(
              'No contacts yet',
              style: GoogleFonts.poppins(
                fontSize: 16,
                color: Colors.grey[600],
              ),
            ),
          ],
        ),
      );
    }

    return ListView.builder(
      itemCount: _users.length,
      itemBuilder: (context, index) {
        final user = _users[index];
        return ListTile(
          leading: CircleAvatar(
            backgroundImage: user['photoURL'] != null
                ? CachedNetworkImageProvider(user['photoURL'])
                : null,
            child: user['photoURL'] == null
                ? Text(user['displayName'][0].toUpperCase())
                : null,
          ),
          title: Text(
            user['displayName'],
            style: GoogleFonts.poppins(
              fontWeight: FontWeight.w500,
            ),
          ),
          subtitle: Text(
            user['email'],
            style: GoogleFonts.poppins(
              color: Colors.grey[600],
            ),
          ),
          onTap: () {
            Navigator.push(
              context,
              MaterialPageRoute(
                builder: (context) => ChatScreen(userId: user['id']),
              ),
            );
          },
        );
      },
    );
  }
} 
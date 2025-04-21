import 'dart:io';
import 'dart:async';
import 'package:uuid/uuid.dart';
import '../models/chat_group.dart';
import '../models/chat_message.dart';
import 'package:flutter/material.dart';
import '../models/user.dart' as app_user;
import 'package:file_picker/file_picker.dart';
import 'package:image_picker/image_picker.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter_chat_ui/flutter_chat_ui.dart';
import 'package:firebase_storage/firebase_storage.dart';
import 'package:flutter_chat_types/flutter_chat_types.dart' as types;

class ChatScreen extends StatefulWidget {
  final ChatGroup group;

  const ChatScreen({super.key, required this.group});

  @override
  State<ChatScreen> createState() => _ChatScreenState();
}

class _ChatScreenState extends State<ChatScreen> {
  final _firestore = FirebaseFirestore.instance;
  final _auth = FirebaseAuth.instance;
  final _storage = FirebaseStorage.instance;
  final _picker = ImagePicker();
  final _uuid = const Uuid();
  List<types.Message> _messages = [];
  bool _isLoading = true;
  String? _error;
  StreamSubscription? _messageSubscription;
  app_user.User? _currentUser;

  @override
  void initState() {
    super.initState();
    _initializeChat();
  }

  @override
  void dispose() {
    _messageSubscription?.cancel();
    super.dispose();
  }

  Future<void> _initializeChat() async {
    try {
      final userDoc = await _firestore
          .collection('users')
          .doc(_auth.currentUser?.uid)
          .get();

      if (!userDoc.exists) {
        throw Exception('User not found');
      }

      setState(() {
        _currentUser = app_user.User.fromMap(userDoc.data()!);
      });

      final groupDoc = await _firestore
          .collection('chat_groups')
          .doc(widget.group.id)
          .get();

      if (!groupDoc.exists) {
        throw Exception('Chat group not found');
      }

      _messageSubscription = _firestore
          .collection('chat_groups')
          .doc(widget.group.id)
          .collection('messages')
          .orderBy('timestamp', descending: true)
          .snapshots()
          .listen((snapshot) {
        final messages = snapshot.docs.map((doc) {
          final data = doc.data();
          return types.TextMessage(
            author: types.User(id: data['senderId']),
            createdAt: (data['timestamp'] as Timestamp).toDate().millisecondsSinceEpoch,
            id: doc.id,
            text: data['content'],
            metadata: {
              'status': data['status'],
              'type': data['type'],
            },
          );
        }).toList();

        setState(() {
          _messages = messages;
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

  Future<void> _handleSendMessage(types.PartialText message) async {
    if (!mounted) return;
    
    try {
      final messageId = _uuid.v4();
      final messageData = {
        'id': messageId,
        'content': message.text,
        'senderId': _auth.currentUser?.uid,
        'timestamp': FieldValue.serverTimestamp(),
        'status': 'sent',
        'type': 'text',
      };

      await _firestore
          .collection('chat_groups')
          .doc(widget.group.id)
          .collection('messages')
          .doc(messageId)
          .set(messageData);

      await _firestore
          .collection('chat_groups')
          .doc(widget.group.id)
          .update({
        'lastMessage': message.text,
        'lastMessageTime': FieldValue.serverTimestamp(),
      });
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Failed to send message: ${e.toString()}')),
      );
    }
  }

  Future<void> _handleImageSelection() async {
    if (!mounted) return;
    
    try {
      final pickedFile = await _picker.pickImage(source: ImageSource.gallery);
      if (pickedFile == null) return;

      final file = File(pickedFile.path);
      final fileName = '${_uuid.v4()}.jpg';
      final ref = _storage.ref().child('chat_images/$fileName');

      await ref.putFile(file);
      final url = await ref.getDownloadURL();

      final messageId = _uuid.v4();
      final messageData = {
        'id': messageId,
        'content': url,
        'senderId': _auth.currentUser?.uid,
        'timestamp': FieldValue.serverTimestamp(),
        'status': 'sent',
        'type': 'image',
        'name': fileName,
        'size': await file.length(),
      };

      await _firestore
          .collection('chat_groups')
          .doc(widget.group.id)
          .collection('messages')
          .doc(messageId)
          .set(messageData);

      await _firestore
          .collection('chat_groups')
          .doc(widget.group.id)
          .update({
        'lastMessage': 'Image',
        'lastMessageTime': FieldValue.serverTimestamp(),
      });
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Failed to send image: ${e.toString()}')),
      );
    }
  }

  Future<void> _handleFileSelection() async {
    if (!mounted) return;
    
    try {
      final result = await FilePicker.platform.pickFiles();
      if (result == null) return;

      final file = File(result.files.single.path!);
      final fileName = result.files.single.name;
      final ref = _storage.ref().child('chat_files/$fileName');

      await ref.putFile(file);
      final url = await ref.getDownloadURL();

      final messageId = _uuid.v4();
      final messageData = {
        'id': messageId,
        'content': url,
        'senderId': _auth.currentUser?.uid,
        'timestamp': FieldValue.serverTimestamp(),
        'status': 'sent',
        'type': 'file',
        'name': fileName,
        'size': await file.length(),
      };

      await _firestore
          .collection('chat_groups')
          .doc(widget.group.id)
          .collection('messages')
          .doc(messageId)
          .set(messageData);

      await _firestore
          .collection('chat_groups')
          .doc(widget.group.id)
          .update({
        'lastMessage': 'File: $fileName',
        'lastMessageTime': FieldValue.serverTimestamp(),
      });
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Failed to send file: ${e.toString()}')),
      );
    }
  }

  Future<void> _showChatInfo() async {
    if (!mounted) return;
    
    final groupDoc = await _firestore
        .collection('chat_groups')
        .doc(widget.group.id)
        .get();

    final groupData = groupDoc.data();
    if (groupData == null) return;

    final members = await Future.wait(
      (groupData['members'] as List).map((id) async {
        final userDoc = await _firestore.collection('users').doc(id).get();
        return app_user.User.fromMap(userDoc.data()!);
      }),
    );

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Chat Info'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Group Name: ${groupData['name']}'),
            const SizedBox(height: 8),
            const Text('Members:'),
            ...members.map((user) => Text('- ${user.name}')),
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
  }

  Future<void> _toggleMuteNotifications() async {
    if (!mounted) return;
    
    try {
      final userRef = _firestore
          .collection('users')
          .doc(_auth.currentUser?.uid);

      final userDoc = await userRef.get();
      final mutedGroups = List<String>.from(userDoc.data()?['mutedGroups'] ?? []);

      if (mutedGroups.contains(widget.group.id)) {
        mutedGroups.remove(widget.group.id);
      } else {
        mutedGroups.add(widget.group.id);
      }

      await userRef.update({'mutedGroups': mutedGroups});

      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            mutedGroups.contains(widget.group.id)
                ? 'Chat muted'
                : 'Chat unmuted',
          ),
        ),
      );
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Failed to update notification settings: ${e.toString()}')),
      );
    }
  }

  Future<void> _clearChat() async {
    if (!mounted) return;
    
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Clear Chat'),
        content: const Text('Are you sure you want to clear all messages? This action cannot be undone.'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () => Navigator.pop(context, true),
            child: const Text('Clear'),
          ),
        ],
      ),
    );

    if (confirmed != true) return;

    try {
      final messages = await _firestore
          .collection('chat_groups')
          .doc(widget.group.id)
          .collection('messages')
          .get();

      final batch = _firestore.batch();
      for (final doc in messages.docs) {
        batch.delete(doc.reference);
      }
      await batch.commit();

      await _firestore
          .collection('chat_groups')
          .doc(widget.group.id)
          .update({
        'lastMessage': null,
        'lastMessageTime': null,
      });

      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Chat cleared successfully')),
      );
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Failed to clear chat: ${e.toString()}')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return const Scaffold(
        body: Center(child: CircularProgressIndicator()),
      );
    }

    if (_error != null) {
      return Scaffold(
        appBar: AppBar(title: const Text('Error')),
        body: Center(child: Text(_error!)),
      );
    }

    return Scaffold(
      appBar: AppBar(
        title: Text(widget.group.name),
        actions: [
          IconButton(
            icon: const Icon(Icons.info_outline),
            onPressed: _showChatInfo,
          ),
          IconButton(
            icon: const Icon(Icons.notifications),
            onPressed: _toggleMuteNotifications,
          ),
          IconButton(
            icon: const Icon(Icons.delete_outline),
            onPressed: _clearChat,
          ),
        ],
      ),
      body: Chat(
        messages: _messages,
        onSendPressed: _handleSendMessage,
        onAttachmentPressed: _handleFileSelection,
        onImagePressed: _handleImageSelection,
        user: types.User(id: _auth.currentUser?.uid ?? ''),
      ),
    );
  }
} 
import 'dart:io';
import 'package:intl/intl.dart';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_storage/firebase_storage.dart';

class SocialFeedScreen extends StatefulWidget {
  const SocialFeedScreen({Key? key}) : super(key: key);

  @override
  _SocialFeedScreenState createState() => _SocialFeedScreenState();
}

class _SocialFeedScreenState extends State<SocialFeedScreen> {
  final TextEditingController _postController = TextEditingController();
  final ImagePicker _picker = ImagePicker();
  File? _imageFile;
  String? _selectedGroupId;
  List<Map<String, dynamic>> _groups = [];

  @override
  void initState() {
    super.initState();
    _loadGroups();
  }

  Future<void> _loadGroups() async {
    final user = FirebaseAuth.instance.currentUser;
    if (user == null) return;

    final groupsSnapshot = await FirebaseFirestore.instance
        .collection('groups')
        .where('members', arrayContains: user.uid)
        .get();

    setState(() {
      _groups = groupsSnapshot.docs
          .map((doc) => {'id': doc.id, ...doc.data()})
          .toList();
      if (_groups.isNotEmpty) {
        _selectedGroupId = _groups.first['id'];
      }
    });
  }

  Future<void> _pickImage() async {
    final pickedFile = await _picker.pickImage(source: ImageSource.gallery);
    if (pickedFile != null) {
      setState(() {
        _imageFile = File(pickedFile.path);
      });
    }
  }

  Future<void> _createPost() async {
    if (_postController.text.isEmpty && _imageFile == null) return;
    if (_selectedGroupId == null) return;

    final user = FirebaseAuth.instance.currentUser;
    if (user == null) return;

    String? imageUrl;
    if (_imageFile != null) {
      final ref = FirebaseStorage.instance
          .ref()
          .child('posts')
          .child('${DateTime.now().millisecondsSinceEpoch}.jpg');
      await ref.putFile(_imageFile!);
      imageUrl = await ref.getDownloadURL();
    }

    await FirebaseFirestore.instance
        .collection('groups')
        .doc(_selectedGroupId)
        .collection('posts')
        .add({
      'content': _postController.text,
      'imageUrl': imageUrl,
      'authorId': user.uid,
      'authorName': user.displayName,
      'authorPhotoUrl': user.photoURL,
      'timestamp': FieldValue.serverTimestamp(),
      'likes': [],
      'comments': [],
    });

    setState(() {
      _postController.clear();
      _imageFile = null;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[100],
      appBar: AppBar(
        title: Text(
          'Social Feed',
          style: GoogleFonts.poppins(
            fontWeight: FontWeight.w600,
          ),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.group_add),
            onPressed: () {
              // TODO: Implement create/join group
            },
          ),
        ],
      ),
      body: Column(
        children: [
          // Post creation card
          Card(
            margin: const EdgeInsets.all(8),
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                children: [
                  if (_groups.isNotEmpty)
                    DropdownButton<String>(
                      value: _selectedGroupId,
                      items: _groups.map((group) {
                        return DropdownMenuItem<String>(
                          value: group['id'],
                          child: Text(group['name']),
                        );
                      }).toList(),
                      onChanged: (value) {
                        setState(() {
                          _selectedGroupId = value;
                        });
                      },
                    ),
                  TextField(
                    controller: _postController,
                    decoration: InputDecoration(
                      hintText: 'What\'s on your mind?',
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(20),
                      ),
                    ),
                    maxLines: 3,
                  ),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      IconButton(
                        icon: const Icon(Icons.photo_library),
                        onPressed: _pickImage,
                      ),
                      if (_imageFile != null)
                        Expanded(
                          child: Stack(
                            children: [
                              Image.file(
                                _imageFile!,
                                height: 100,
                                fit: BoxFit.cover,
                              ),
                              Positioned(
                                right: 0,
                                child: IconButton(
                                  icon: const Icon(Icons.close),
                                  onPressed: () {
                                    setState(() {
                                      _imageFile = null;
                                    });
                                  },
                                ),
                              ),
                            ],
                          ),
                        ),
                      const Spacer(),
                      ElevatedButton(
                        onPressed: _createPost,
                        child: const Text('Post'),
                        style: ElevatedButton.styleFrom(
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(20),
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
          // Posts stream
          Expanded(
            child: StreamBuilder<QuerySnapshot>(
              stream: _selectedGroupId != null
                  ? FirebaseFirestore.instance
                      .collection('groups')
                      .doc(_selectedGroupId)
                      .collection('posts')
                      .orderBy('timestamp', descending: true)
                      .snapshots()
                  : null,
              builder: (context, snapshot) {
                if (!snapshot.hasData) {
                  return const Center(child: CircularProgressIndicator());
                }

                final posts = snapshot.data!.docs;

                return ListView.builder(
                  itemCount: posts.length,
                  itemBuilder: (context, index) {
                    final post = posts[index].data() as Map<String, dynamic>;
                    return _buildPostCard(post, posts[index].id);
                  },
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPostCard(Map<String, dynamic> post, String postId) {
    return Card(
      margin: const EdgeInsets.all(8),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          ListTile(
            leading: CircleAvatar(
              backgroundImage: post['authorPhotoUrl'] != null
                  ? NetworkImage(post['authorPhotoUrl'])
                  : null,
              child: post['authorPhotoUrl'] == null
                  ? Text(post['authorName'][0])
                  : null,
            ),
            title: Text(
              post['authorName'],
              style: const TextStyle(fontWeight: FontWeight.bold),
            ),
            subtitle: Text(
              DateFormat('MMM d, y • h:mm a').format(
                (post['timestamp'] as Timestamp).toDate(),
              ),
            ),
          ),
          if (post['content'] != null && post['content'].isNotEmpty)
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Text(post['content']),
            ),
          if (post['imageUrl'] != null)
            Image.network(
              post['imageUrl'],
              width: double.infinity,
              fit: BoxFit.cover,
            ),
          Padding(
            padding: const EdgeInsets.all(8),
            child: Row(
              children: [
                IconButton(
                  icon: Icon(
                    (post['likes'] as List).contains(
                      FirebaseAuth.instance.currentUser?.uid,
                    )
                        ? Icons.favorite
                        : Icons.favorite_border,
                    color: (post['likes'] as List).contains(
                      FirebaseAuth.instance.currentUser?.uid,
                    )
                        ? Colors.red
                        : null,
                  ),
                  onPressed: () {
                    // TODO: Implement like functionality
                  },
                ),
                Text('${(post['likes'] as List).length}'),
                const SizedBox(width: 16),
                IconButton(
                  icon: const Icon(Icons.comment),
                  onPressed: () {
                    // TODO: Implement comment functionality
                  },
                ),
                Text('${(post['comments'] as List).length}'),
              ],
            ),
          ),
        ],
      ),
    );
  }
} 
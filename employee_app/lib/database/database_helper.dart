import 'dart:io';
import 'dart:convert';
import '../models/shift.dart';
import 'package:path/path.dart';
import 'package:sqflite/sqflite.dart';
import 'package:path_provider/path_provider.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class DatabaseHelper {
  static final DatabaseHelper instance = DatabaseHelper._init();
  static Database? _database;
  final _storage = const FlutterSecureStorage();

  DatabaseHelper._init();

  Future<Database> get database async {
    if (_database != null) return _database!;
    _database = await _initDatabase();
    return _database!;
  }

  Future<Database> _initDatabase() async {
    final dbPath = await getDatabasesPath();
    final path = join(dbPath, 'shift_book.db');

    // Get or create encryption key
    String? key = await _storage.read(key: 'db_key');
    if (key == null) {
      key = base64Encode(List<int>.generate(32, (i) => i));
      await _storage.write(key: 'db_key', value: key);
    }

    return await openDatabase(
      path,
      version: 1,
      onCreate: _onCreate,
    );
  }

  Future<void> _onCreate(Database db, int version) async {
    await db.execute('''
      CREATE TABLE shifts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        start_time TEXT NOT NULL,
        end_time TEXT NOT NULL,
        status TEXT NOT NULL,
        clock_in_time TEXT,
        clock_out_time TEXT
      )
    ''');

    await db.execute('''
      CREATE TABLE time_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        shift_id INTEGER NOT NULL,
        type TEXT NOT NULL,
        start_time TEXT NOT NULL,
        end_time TEXT,
        FOREIGN KEY (shift_id) REFERENCES shifts (id) ON DELETE CASCADE
      )
    ''');

    await db.execute('''
      CREATE TABLE time_off_requests (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        start_date TEXT NOT NULL,
        end_date TEXT NOT NULL,
        reason TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )
    ''');
  }

  // Shift operations
  Future<int> insertShift(Shift shift) async {
    final db = await database;
    return await db.insert('shifts', shift.toJson());
  }

  Future<List<Shift>> getShifts() async {
    final db = await database;
    final List<Map<String, dynamic>> maps = await db.query('shifts');
    
    return List.generate(maps.length, (i) {
      return Shift.fromJson(maps[i]);
    });
  }

  Future<Shift?> getShift(int id) async {
    final db = await database;
    final List<Map<String, dynamic>> maps = await db.query(
      'shifts',
      where: 'id = ?',
      whereArgs: [id],
    );

    if (maps.isNotEmpty) {
      return Shift.fromJson(maps.first);
    }
    return null;
  }

  Future<int> updateShift(Shift shift) async {
    final db = await database;
    return await db.update(
      'shifts',
      shift.toJson(),
      where: 'id = ?',
      whereArgs: [shift.id],
    );
  }

  // Time log operations
  Future<int> insertTimeLog({
    required int shiftId,
    required String type,
    required DateTime startTime,
    DateTime? endTime,
  }) async {
    final db = await database;
    return await db.insert('time_logs', {
      'shift_id': shiftId,
      'type': type,
      'start_time': startTime.toIso8601String(),
      'end_time': endTime?.toIso8601String(),
    });
  }

  Future<List<TimeLog>> getTimeLogsByShift(int shiftId) async {
    final db = await database;
    final List<Map<String, dynamic>> maps = await db.query(
      'time_logs',
      where: 'shift_id = ?',
      whereArgs: [shiftId],
    );

    return List.generate(maps.length, (i) {
      return TimeLog.fromJson(maps[i]);
    });
  }

  // Time off request operations
  Future<int> insertTimeOffRequest({
    required int userId,
    required DateTime startDate,
    required DateTime endDate,
    required String reason,
  }) async {
    final db = await database;
    final now = DateTime.now().toIso8601String();
    return await db.insert('time_off_requests', {
      'user_id': userId,
      'start_date': startDate.toIso8601String(),
      'end_date': endDate.toIso8601String(),
      'reason': reason,
      'status': 'pending',
      'created_at': now,
      'updated_at': now,
    });
  }

  Future<List<Map<String, dynamic>>> getTimeOffRequests(int userId) async {
    final db = await database;
    return await db.query(
      'time_off_requests',
      where: 'user_id = ?',
      whereArgs: [userId],
      orderBy: 'created_at DESC',
    );
  }

  Future<int> updateTimeOffRequestStatus(int id, String status) async {
    final db = await database;
    return await db.update(
      'time_off_requests',
      {
        'status': status,
        'updated_at': DateTime.now().toIso8601String(),
      },
      where: 'id = ?',
      whereArgs: [id],
    );
  }

  Future<void> close() async {
    final db = await database;
    db.close();
  }
} 
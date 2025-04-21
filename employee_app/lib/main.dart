import 'screens/login_screen.dart';
import 'screens/shifts_screen.dart';
import 'screens/time_off_screen.dart';
import 'screens/settings_screen.dart';
import 'providers/auth_provider.dart';
import 'screens/schedule_screen.dart';
import 'package:flutter/material.dart';
import 'screens/dashboard_screen.dart';
import 'providers/shift_provider.dart';
import 'package:provider/provider.dart';
import 'providers/time_off_provider.dart';
import 'screens/time_off_request_screen.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:employee_app/config/firebase_config.dart';

// Screens

// Providers

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await FirebaseConfig.initializeFirebase();
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider()),
        ChangeNotifierProvider(create: (_) => ShiftProvider()),
        ChangeNotifierProvider(create: (_) => TimeOffProvider()),
      ],
      child: MaterialApp(
        title: 'Shift-Bookk',
        theme: ThemeData(
          primarySwatch: Colors.blue,
          scaffoldBackgroundColor: Colors.grey[100],
          appBarTheme: const AppBarTheme(
            backgroundColor: Colors.white,
            foregroundColor: Colors.black,
            elevation: 0,
          ),
          elevatedButtonTheme: ElevatedButtonThemeData(
            style: ElevatedButton.styleFrom(
              padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 12),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(8),
              ),
            ),
          ),
          inputDecorationTheme: InputDecorationTheme(
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(8),
            ),
            contentPadding: const EdgeInsets.symmetric(
              horizontal: 16,
              vertical: 12,
            ),
          ),
          cardTheme: CardTheme(
            elevation: 2,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
            ),
          ),
          textTheme: GoogleFonts.poppinsTextTheme(),
        ),
        initialRoute: '/login',
        routes: {
          '/login': (context) => const LoginScreen(),
          '/dashboard': (context) => const DashboardScreen(),
          '/shifts': (context) => const ShiftsScreen(),
          '/time-off': (context) => const TimeOffScreen(),
          '/settings': (context) => const SettingsScreen(),
          '/time-off-request': (context) => const TimeOffRequestScreen(),
          '/schedule': (context) => const ScheduleScreen(),
        },
      ),
    );
  }
}

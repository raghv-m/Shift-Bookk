import '../models/shift.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/shift_provider.dart';

class ShiftsScreen extends StatelessWidget {
  const ShiftsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('My Shifts'),
      ),
      body: Consumer<ShiftProvider>(
        builder: (context, shiftProvider, child) {
          if (shiftProvider.isLoading) {
            return const Center(child: CircularProgressIndicator());
          }

          if (shiftProvider.error != null) {
            return Center(
              child: Text(
                shiftProvider.error!,
                style: const TextStyle(color: Colors.red),
              ),
            );
          }

          final shifts = shiftProvider.shifts;
          if (shifts.isEmpty) {
            return const Center(
              child: Text('No shifts scheduled'),
            );
          }

          return ListView.builder(
            padding: const EdgeInsets.all(16),
            itemCount: shifts.length,
            itemBuilder: (context, index) {
              final shift = shifts[index];
              return _ShiftCard(shift: shift);
            },
          );
        },
      ),
    );
  }
}

class _ShiftCard extends StatelessWidget {
  final Shift shift;

  const _ShiftCard({required this.shift});

  @override
  Widget build(BuildContext context) {
    final shiftProvider = context.read<ShiftProvider>();
    final isClockedIn = shift.clockInTime != null;
    final isOnBreak = shift.timeLogs.any((log) => 
      log.type == 'break_start' && log.endTime == null);

    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              '${shift.startTime.toString()} - ${shift.endTime.toString()}',
              style: const TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 8),
            Text('Status: ${shift.status}'),
            if (shift.clockInTime != null)
              Text('Clocked in: ${shift.clockInTime.toString()}'),
            if (shift.clockOutTime != null)
              Text('Clocked out: ${shift.clockOutTime.toString()}'),
            const SizedBox(height: 16),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                if (!isClockedIn)
                  ElevatedButton(
                    onPressed: () => shiftProvider.clockIn(shift.id),
                    child: const Text('Clock In'),
                  ),
                if (isClockedIn && !isOnBreak)
                  ElevatedButton(
                    onPressed: () => shiftProvider.startBreak(shift.id),
                    child: const Text('Start Break'),
                  ),
                if (isClockedIn && isOnBreak)
                  ElevatedButton(
                    onPressed: () => shiftProvider.endBreak(shift.id),
                    child: const Text('End Break'),
                  ),
                if (isClockedIn)
                  ElevatedButton(
                    onPressed: () => shiftProvider.clockOut(shift.id),
                    child: const Text('Clock Out'),
                  ),
              ],
            ),
          ],
        ),
      ),
    );
  }
} 
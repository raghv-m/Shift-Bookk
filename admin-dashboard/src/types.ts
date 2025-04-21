import { Timestamp } from 'firebase/firestore';

export interface AppUser {
  id: string;
  uid: string;
  email: string;
  displayName?: string;
  department?: string;
  role: 'admin' | 'manager' | 'employee';
  status: 'active' | 'inactive';
  createdAt: Timestamp;
  updatedAt: Timestamp;
  photoURL?: string;
}

export interface User {
  id: string;
  email: string;
  displayName: string;
  role: 'admin' | 'employee';
  department?: string;
  status: 'active' | 'inactive';
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Shift {
  id: string;
  title: string;
  employeeId: string;
  startTime: Timestamp;
  endTime: Timestamp;
  status: 'pending' | 'approved' | 'rejected' | 'completed' | 'in-progress' | 'cancelled' | 'scheduled';
  notes?: string;
  description?: string;
  location?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  isRecurring?: boolean;
}

export interface TimeOffRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  startDate: Timestamp;
  endDate: Timestamp;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface TimeLog {
  id: string;
  employeeId: string;
  clockIn: Timestamp;
  clockOut: Timestamp | null;
  status: 'in-progress' | 'completed';
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  read: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface SystemSettings {
  organizationName: string;
  timeZone: string;
  workWeekStart: string;
  workWeekEnd: string;
  allowShiftOverlap: boolean;
  maxShiftDuration: number;
  minShiftDuration: number;
  requireShiftApproval: boolean;
  allowTimeOffRequests: boolean;
  maxTimeOffDays: number;
  requireTimeOffApproval: boolean;
  updatedAt: Timestamp;
}

export interface EmployeeHours {
  employeeId: string;
  totalHours: number;
  weeklyHours: number;
  monthlyHours: number;
  lastUpdated: Timestamp;
}

export interface TimeOffStats {
  employeeId: string;
  totalDaysOff: number;
  sickDays: number;
  vacationDays: number;
  remainingDays: number;
  year: number;
}

export const formatTimestamp = (timestamp: Timestamp | null | undefined): string => {
  if (!timestamp) return '';
  return timestamp.toDate().toLocaleString();
};

export const timestampToDate = (timestamp: Timestamp | null | undefined): Date | null => {
  if (!timestamp) return null;
  return timestamp.toDate();
}; 
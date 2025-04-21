import { Timestamp } from 'firebase/firestore';

export interface User {
  uid: string;
  email: string;
  role: 'admin' | 'employee';
  displayName?: string;
  photoURL?: string;
  department?: string;
  status: 'active' | 'inactive';
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Shift {
  id: string;
  employeeId: string;
  title: string;
  startTime: Timestamp;
  endTime: Timestamp;
  status: 'scheduled' | 'inProgress' | 'completed' | 'cancelled';
  recurring: boolean;
  recurrencePattern?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    interval: number;
    endDate?: Timestamp;
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface TimeLog {
  id: string;
  shiftId: string;
  type: 'clockIn' | 'clockOut' | 'breakStart' | 'breakEnd';
  timestamp: Timestamp;
  location?: {
    latitude: number;
    longitude: number;
  };
}

export interface TimeOffRequest {
  id: string;
  employeeId: string;
  startDate: Timestamp;
  endDate: Timestamp;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface ShiftSwap {
  id: string;
  originalShiftId: string;
  originalEmployeeId: string;
  newEmployeeId: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  authorId: string;
  pinned: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Group {
  id: string;
  name: string;
  description?: string;
  members: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Message {
  id: string;
  groupId: string;
  senderId: string;
  content: string;
  type: 'text' | 'image' | 'file';
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  createdAt: Timestamp;
}

export interface File {
  id: string;
  name: string;
  url: string;
  uploaderId: string;
  groupId?: string;
  size: number;
  type: string;
  createdAt: Timestamp;
}

export interface Settings {
  company: {
    name: string;
    address: string;
    phone: string;
    email: string;
  };
  shifts: {
    defaultStartTime: string;
    defaultEndTime: string;
    breakDuration: number;
    overtimeThreshold: number;
  };
  notifications: {
    email: boolean;
    push: boolean;
    shiftReminder: boolean;
    timeOffApproval: boolean;
  };
} 
import { Timestamp } from 'firebase/firestore';

/**
 * Converts a Firestore Timestamp to a JavaScript Date
 * Safely handles null/undefined values
 * 
 * @param timestamp The Firestore Timestamp to convert
 * @returns Date object or null if timestamp is null/undefined
 */
export const timestampToDate = (timestamp: Timestamp | null | undefined): Date | null => {
  if (!timestamp) return null;
  return timestamp.toDate();
};

/**
 * Format a Firestore Timestamp to a readable date/time string
 * @param timestamp Firestore Timestamp to format
 * @param format Optional format type ('date', 'time', 'datetime')
 * @returns Formatted date/time string
 */
export const formatTimestamp = (
  timestamp: Timestamp | null | undefined, 
  format: 'date' | 'time' | 'datetime' = 'datetime'
): string => {
  if (!timestamp) return '';
  
  const date = timestamp.toDate();
  
  if (format === 'date') {
    return date.toLocaleDateString();
  } else if (format === 'time') {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else {
    return date.toLocaleString();
  }
};

/**
 * Calculates relative time (e.g., "2 hours ago", "in 3 days")
 * @param date The date to calculate relative time for
 * @returns A string representing the relative time
 */
export const getRelativeTimeString = (date: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  
  if (Math.abs(diffInSeconds) < 60) {
    return rtf.format(-Math.sign(diffInSeconds), 'second');
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  
  if (Math.abs(diffInMinutes) < 60) {
    return rtf.format(-Math.sign(diffInSeconds) * Math.abs(diffInMinutes), 'minute');
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  
  if (Math.abs(diffInHours) < 24) {
    return rtf.format(-Math.sign(diffInSeconds) * Math.abs(diffInHours), 'hour');
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  
  if (Math.abs(diffInDays) < 30) {
    return rtf.format(-Math.sign(diffInSeconds) * Math.abs(diffInDays), 'day');
  }
  
  const diffInMonths = Math.floor(diffInDays / 30);
  
  if (Math.abs(diffInMonths) < 12) {
    return rtf.format(-Math.sign(diffInSeconds) * Math.abs(diffInMonths), 'month');
  }
  
  const diffInYears = Math.floor(diffInDays / 365);
  return rtf.format(-Math.sign(diffInSeconds) * Math.abs(diffInYears), 'year');
};

/**
 * Calculates the duration between two timestamps in hours
 * Safely handles null/undefined values
 * 
 * @param startTime Starting timestamp
 * @param endTime Ending timestamp
 * @returns Number of hours between timestamps or 0 if either timestamp is null/undefined
 */
export const calculateHoursBetweenTimestamps = (
  startTime: Timestamp | null | undefined, 
  endTime: Timestamp | null | undefined
): number => {
  if (!startTime || !endTime) return 0;
  
  const startDate = startTime.toDate();
  const endDate = endTime.toDate();
  
  const diffMs = endDate.getTime() - startDate.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);
  
  return diffHours;
};

/**
 * Checks if a timestamp is in the past
 * 
 * @param timestamp The timestamp to check
 * @returns boolean indicating if timestamp is in the past
 */
export const isTimestampInPast = (timestamp: Timestamp | null | undefined): boolean => {
  if (!timestamp) return false;
  
  const now = new Date();
  const date = timestamp.toDate();
  
  return date < now;
};

/**
 * Checks if a timestamp is within a given range
 * 
 * @param timestamp The timestamp to check
 * @param startRange Start of the range
 * @param endRange End of the range
 * @returns boolean indicating if timestamp is within the range
 */
export const isTimestampInRange = (
  timestamp: Timestamp | null | undefined,
  startRange: Date,
  endRange: Date
): boolean => {
  if (!timestamp) return false;
  
  const date = timestamp.toDate();
  return date >= startRange && date <= endRange;
};

/**
 * Gets the start of day for a given date
 * @param date The date to get the start of day for
 * @returns A new Date object representing the start of the day
 */
export const getStartOfDay = (date: Date): Date => {
  const newDate = new Date(date);
  newDate.setHours(0, 0, 0, 0);
  return newDate;
};

/**
 * Gets the end of day for a given date
 * @param date The date to get the end of day for
 * @returns A new Date object representing the end of the day
 */
export const getEndOfDay = (date: Date): Date => {
  const newDate = new Date(date);
  newDate.setHours(23, 59, 59, 999);
  return newDate;
};

/**
 * Gets the start of week for a given date (Sunday by default)
 * @param date The date to get the start of week for
 * @param startOnMonday Whether the week should start on Monday
 * @returns A new Date object representing the start of the week
 */
export const getStartOfWeek = (date: Date, startOnMonday = false): Date => {
  const newDate = new Date(date);
  const day = newDate.getDay();
  const diff = startOnMonday 
    ? day === 0 ? 6 : day - 1 // If Sunday and startOnMonday, go back 6 days
    : day; // Otherwise, go back by the day number
  newDate.setDate(newDate.getDate() - diff);
  return getStartOfDay(newDate);
};

/**
 * Gets the end of week for a given date (Saturday by default)
 * @param date The date to get the end of week for
 * @param startOnMonday Whether the week should start on Monday (end on Sunday)
 * @returns A new Date object representing the end of the week
 */
export const getEndOfWeek = (date: Date, startOnMonday = false): Date => {
  const newDate = getStartOfWeek(date, startOnMonday);
  newDate.setDate(newDate.getDate() + 6);
  return getEndOfDay(newDate);
};

/**
 * Gets the start of month for a given date
 * @param date The date to get the start of month for
 * @returns A new Date object representing the start of the month
 */
export const getStartOfMonth = (date: Date): Date => {
  const newDate = new Date(date);
  newDate.setDate(1);
  return getStartOfDay(newDate);
};

/**
 * Gets the end of month for a given date
 * @param date The date to get the end of month for
 * @returns A new Date object representing the end of the month
 */
export const getEndOfMonth = (date: Date): Date => {
  const newDate = new Date(date);
  newDate.setMonth(newDate.getMonth() + 1);
  newDate.setDate(0);
  return getEndOfDay(newDate);
};

/**
 * Gets date range for a specific time period
 * @param period The time period ('day', 'week', 'month', 'year')
 * @param date The reference date (defaults to today)
 * @returns An object with start and end dates
 */
export const getDateRangeForPeriod = (
  period: 'day' | 'week' | 'month' | 'year',
  date: Date = new Date()
): { start: Date; end: Date } => {
  const today = new Date(date);
  
  switch (period) {
    case 'day':
      return {
        start: getStartOfDay(today),
        end: getEndOfDay(today)
      };
    case 'week':
      return {
        start: getStartOfWeek(today),
        end: getEndOfWeek(today)
      };
    case 'month':
      return {
        start: getStartOfMonth(today),
        end: getEndOfMonth(today)
      };
    case 'year':
      const startOfYear = new Date(today.getFullYear(), 0, 1);
      const endOfYear = new Date(today.getFullYear(), 11, 31);
      return {
        start: getStartOfDay(startOfYear),
        end: getEndOfDay(endOfYear)
      };
    default:
      return {
        start: getStartOfDay(today),
        end: getEndOfDay(today)
      };
  }
};

/**
 * Converts a JavaScript Date to a Firestore Timestamp
 * @param date The JavaScript Date to convert
 * @returns A Firestore Timestamp or null if date is null/undefined
 */
export const dateToTimestamp = (date: Date | null | undefined): Timestamp | null => {
  if (!date) return null;
  return Timestamp.fromDate(date);
};

/**
 * Calculates the duration between two timestamps in hours
 * @param startTime The start timestamp
 * @param endTime The end timestamp
 * @returns The duration in hours or 0 if either timestamp is missing
 */
export const calculateDurationInHours = (
  startTime: Timestamp | null | undefined, 
  endTime: Timestamp | null | undefined
): number => {
  if (!startTime || !endTime) return 0;
  
  const startDate = startTime.toDate();
  const endDate = endTime.toDate();
  const durationMs = endDate.getTime() - startDate.getTime();
  
  return Math.max(0, durationMs / (1000 * 60 * 60));
};

/**
 * Format duration in hours to a readable string
 * @param hours Number of hours
 * @returns Formatted duration string (e.g., "2h 30m")
 */
export const formatDuration = (hours: number): string => {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  
  if (h === 0) {
    return `${m}m`;
  } else if (m === 0) {
    return `${h}h`;
  } else {
    return `${h}h ${m}m`;
  }
};

/**
 * Checks if a date is today
 * @param date The date to check
 * @returns True if the date is today, false otherwise
 */
export const isToday = (date: Date): boolean => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

/**
 * Formats a date for display in a date picker
 * @param date The date to format
 * @returns A string in YYYY-MM-DD format
 */
export const formatDateForInput = (date: Date | null): string => {
  if (!date) return '';
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};

/**
 * Get time difference in hours between two timestamps
 * @param start Start timestamp
 * @param end End timestamp
 * @returns Hours difference as a number with decimal precision
 */
export const getHoursDifference = (start: Timestamp, end: Timestamp): number => {
  const diffMs = end.toMillis() - start.toMillis();
  return diffMs / (1000 * 60 * 60); // Convert ms to hours
}; 
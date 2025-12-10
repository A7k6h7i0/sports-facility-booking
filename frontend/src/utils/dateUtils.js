/**
 * Date Utility Functions
 */

import { format, parseISO, addHours, isBefore, isAfter } from 'date-fns';

/**
 * Format date to display string
 */
export const formatDate = (date) => {
  if (!date) return '';
  return format(new Date(date), 'MMM dd, yyyy');
};

/**
 * Format datetime to display string
 */
export const formatDateTime = (date) => {
  if (!date) return '';
  return format(new Date(date), 'MMM dd, yyyy hh:mm a');
};

/**
 * Format time only
 */
export const formatTime = (date) => {
  if (!date) return '';
  return format(new Date(date), 'hh:mm a');
};

/**
 * Create ISO datetime string from date and time
 */
export const createDateTime = (date, timeString) => {
  const [hours, minutes] = timeString.split(':');
  const dateTime = new Date(date);
  dateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
  return dateTime.toISOString();
};

/**
 * Get current date without time
 */
export const getTodayDate = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

/**
 * Check if date is in the past
 */
export const isPastDate = (date) => {
  return isBefore(new Date(date), new Date());
};

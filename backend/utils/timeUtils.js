/**
 * Time Utility Functions
 * Handles time overlap checking and time-related calculations
 */

/**
 * Check if two time ranges overlap
 * @param {Date} start1 - Start time of first range
 * @param {Date} end1 - End time of first range
 * @param {Date} start2 - Start time of second range
 * @param {Date} end2 - End time of second range
 * @returns {boolean} True if ranges overlap
 */
const checkTimeOverlap = (start1, end1, start2, end2) => {
  // Convert to timestamps for comparison
  const s1 = new Date(start1).getTime();
  const e1 = new Date(end1).getTime();
  const s2 = new Date(start2).getTime();
  const e2 = new Date(end2).getTime();

  // Overlap occurs if: start1 < end2 AND end1 > start2
  return s1 < e2 && e1 > s2;
};

/**
 * Calculate duration between two times in hours
 * @param {Date} startTime - Start time
 * @param {Date} endTime - End time
 * @returns {number} Duration in hours (decimal)
 */
const calculateDurationInHours = (startTime, endTime) => {
  const start = new Date(startTime).getTime();
  const end = new Date(endTime).getTime();
  const durationMs = end - start;
  return durationMs / (1000 * 60 * 60); // Convert ms to hours
};

/**
 * Check if a time falls within a time range (time of day only)
 * @param {string} timeString - Time in "HH:mm" format
 * @param {string} rangeStart - Start time in "HH:mm" format
 * @param {string} rangeEnd - End time in "HH:mm" format
 * @returns {boolean} True if time is within range
 */
const isTimeInRange = (timeString, rangeStart, rangeEnd) => {
  const [hour, minute] = timeString.split(':').map(Number);
  const [startHour, startMinute] = rangeStart.split(':').map(Number);
  const [endHour, endMinute] = rangeEnd.split(':').map(Number);

  const timeMinutes = hour * 60 + minute;
  const startMinutes = startHour * 60 + startMinute;
  const endMinutes = endHour * 60 + endMinute;

  return timeMinutes >= startMinutes && timeMinutes < endMinutes;
};

/**
 * Get day of week from Date object
 * @param {Date} date - Date object
 * @returns {number} Day of week (0 = Sunday, 6 = Saturday)
 */
const getDayOfWeek = (date) => {
  return new Date(date).getDay();
};

/**
 * Get time string in "HH:mm" format from Date object
 * @param {Date} date - Date object
 * @returns {string} Time in "HH:mm" format
 */
const getTimeString = (date) => {
  const d = new Date(date);
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
};

/**
 * Validate that end time is after start time
 * @param {Date} startTime - Start time
 * @param {Date} endTime - End time
 * @returns {boolean} True if valid
 */
const validateTimeRange = (startTime, endTime) => {
  return new Date(endTime).getTime() > new Date(startTime).getTime();
};

/**
 * Check if booking time is in the past
 * @param {Date} startTime - Booking start time
 * @returns {boolean} True if in the past
 */
const isInPast = (startTime) => {
  return new Date(startTime).getTime() < Date.now();
};

module.exports = {
  checkTimeOverlap,
  calculateDurationInHours,
  isTimeInRange,
  getDayOfWeek,
  getTimeString,
  validateTimeRange,
  isInPast
};

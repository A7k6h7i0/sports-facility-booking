/**
 * Application Constants
 * Complete configuration with all features
 */

// API Configuration - Use environment variable or fallback
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Time slots for booking (6 AM to 10 PM)
export const TIME_SLOTS = [
  '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
  '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
  '18:00', '19:00', '20:00', '21:00', '22:00'
];

// Booking status types
export const BOOKING_STATUSES = {
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed'
};

// Court types
export const COURT_TYPES = {
  INDOOR: 'indoor',
  OUTDOOR: 'outdoor'
};

// Pricing rule types for admin
export const RULE_TYPES = [
  { value: 'peak_hour', label: 'Peak Hour' },
  { value: 'weekend', label: 'Weekend' },
  { value: 'indoor_premium', label: 'Indoor Premium' },
  { value: 'seasonal', label: 'Seasonal' },
  { value: 'custom', label: 'Custom' }
];

// Days of week for scheduling
export const DAYS_OF_WEEK = [
  { value: 0, label: 'Sunday' },
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' }
];

// Log API URL in development for debugging
if (import.meta.env.DEV) {
  console.log('🌐 API Base URL:', API_BASE_URL);
  console.log('🔧 Environment:', import.meta.env.MODE);
}

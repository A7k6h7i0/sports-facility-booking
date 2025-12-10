/**
 * API Service
 * Centralized axios-based API calls with authentication
 */

import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor 
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Extract meaningful error message
    const errorData = error.response?.data;
    const message = errorData?.message || errorData?.error || error.message || 'An error occurred';
    
    // If 401, logout user
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    
    // Create custom error object with response data
    const customError = new Error(message);
    customError.response = error.response;
    customError.data = errorData;
    
    return Promise.reject(customError);
  }
);


// ===== Auth APIs =====
export const loginUser = async (email, password) => {
  return await api.post('/auth/login', { email, password });
};

export const registerUser = async (userData) => {
  return await api.post('/auth/register', userData);
};

export const getCurrentUser = async () => {
  return await api.get('/auth/me');
};

export const logoutUser = async () => {
  return await api.post('/auth/logout');
};

// ===== Court APIs =====
export const fetchCourts = async () => {
  return await api.get('/courts?active=true');
};

export const fetchCourtById = async (id) => {
  return await api.get(`/courts/${id}`);
};

// ===== Equipment APIs =====
export const fetchEquipment = async () => {
  return await api.get('/equipment?active=true');
};

// ===== Coach APIs =====
export const fetchCoaches = async () => {
  return await api.get('/coaches?active=true');
};

// ===== Pricing APIs =====
export const getPriceEstimate = async (bookingData) => {
  return await api.post('/pricing/estimate', bookingData);
};

// ===== Booking APIs =====
export const createBooking = async (bookingData) => {
  return await api.post('/bookings', bookingData);
};

export const fetchUserBookings = async () => {
  return await api.get('/bookings');
};

export const fetchAllBookings = async () => {
  return await api.get('/bookings/all');
};

export const cancelBooking = async (bookingId) => {
  return await api.put(`/bookings/${bookingId}/cancel`);
};

export const checkAvailability = async (availabilityData) => {
  return await api.post('/bookings/check-availability', availabilityData);
};

// ===== Admin APIs =====
export const fetchPricingRules = async () => {
  return await api.get('/admin/pricing-rules');
};

export const createPricingRule = async (ruleData) => {
  return await api.post('/admin/pricing-rules', ruleData);
};

export const updatePricingRule = async (id, ruleData) => {
  return await api.put(`/admin/pricing-rules/${id}`, ruleData);
};

export const deletePricingRule = async (id) => {
  return await api.delete(`/admin/pricing-rules/${id}`);
};

export const toggleCourtStatus = async (id) => {
  return await api.patch(`/admin/courts/${id}/toggle`);
};

export const toggleEquipmentStatus = async (id) => {
  return await api.patch(`/admin/equipment/${id}/toggle`);
};

export const toggleCoachStatus = async (id) => {
  return await api.patch(`/admin/coaches/${id}/toggle`);
};

export default api;

/**
 * MyBookings Component
 * Display user's booking history
 */

import React, { useState, useEffect } from 'react';
import { fetchUserBookings, cancelBooking } from '../services/api';
import { formatDateTime, formatDate, formatTime } from '../utils/dateUtils';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import ErrorMessage from '../components/common/ErrorMessage';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  const { user } = useAuth();

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const response = await fetchUserBookings();
      setBookings(response.data || []);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      await cancelBooking(bookingId);
      await loadBookings();
    } catch (err) {
      alert('Error cancelling booking: ' + err.message);
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true;
    return booking.status === filter;
  });

  if (loading) return <Loader text="Loading your bookings..." />;
  if (error) return <ErrorMessage message={error} onRetry={loadBookings} />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          My Bookings
        </h1>
        <p className="text-gray-600">
          Welcome back, {user?.name}! View and manage your sports facility bookings
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-1 mb-6 border-b border-gray-200">
        {[
          { key: 'all', label: 'All Bookings' },
          { key: 'confirmed', label: 'Confirmed' },
          { key: 'cancelled', label: 'Cancelled' },
          { key: 'completed', label: 'Completed' }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`
              px-4 py-2 font-medium transition border-b-2
              ${filter === tab.key
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <svg className="w-20 h-20 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No bookings found</h3>
          <p className="text-gray-500 mb-4">You don't have any {filter !== 'all' ? filter : ''} bookings yet</p>
          <Button onClick={() => window.location.href = '/'}>
            Make a Booking
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {/* Status Badge */}
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`
                      px-3 py-1 text-sm font-medium rounded-full
                      ${booking.status === 'confirmed' 
                        ? 'bg-green-100 text-green-700'
                        : booking.status === 'cancelled'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-gray-100 text-gray-700'
                      }
                    `}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                    <span className="text-sm text-gray-500">
                      Booked on {formatDate(booking.createdAt)}
                    </span>
                  </div>

                  {/* Court Info */}
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {booking.court.name}
                  </h3>
                  
                  {/* Booking Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Date & Time</p>
                      <p className="font-medium text-gray-900">
                        {formatDate(booking.startTime)}
                      </p>
                      <p className="text-gray-700">
                        {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500 mb-1">Total Price</p>
                      <p className="text-2xl font-bold text-primary-600">
                        ₹{booking.pricing.totalPrice.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Additional Services */}
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    {booking.equipment && booking.equipment.length > 0 && (
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                        Equipment: {booking.equipment.length} item(s)
                      </div>
                    )}
                    
                    {booking.coach.coachId && (
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Coach Included
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                {booking.status === 'confirmed' && (
                  <div className="ml-6">
                    <Button
                      onClick={() => handleCancelBooking(booking._id)}
                      variant="danger"
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;

/**
 * AdminBookings Component
 * Display all bookings for admin view with comprehensive error handling
 */

import React, { useState, useEffect } from 'react';
import { fetchAllBookings } from '../../services/api';
import { formatDate, formatTime } from '../../utils/dateUtils';
import Loader from '../common/Loader';
import ErrorMessage from '../common/ErrorMessage';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching all bookings...');
      const response = await fetchAllBookings();
      console.log('Response received:', response);
      
      if (response && response.data) {
        setBookings(response.data);
        console.log('Bookings set:', response.data.length, 'items');
      } else {
        setBookings([]);
        console.warn('No data in response');
      }
    } catch (err) {
      console.error('Error loading bookings:', err);
      setError(err.message || 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  // Safe filtering with null checks
  const filteredBookings = bookings.filter(booking => {
    try {
      if (filter !== 'all' && booking?.status !== filter) return false;
      
      if (searchTerm && searchTerm.trim() !== '') {
        const search = searchTerm.toLowerCase();
        const customerName = booking?.customerName?.toLowerCase() || '';
        const customerEmail = booking?.customerEmail?.toLowerCase() || '';
        const courtName = booking?.court?.name?.toLowerCase() || '';
        
        return customerName.includes(search) || 
               customerEmail.includes(search) || 
               courtName.includes(search);
      }
      return true;
    } catch (err) {
      console.error('Filter error:', err);
      return false;
    }
  });

  // Safe stats calculation
  const stats = {
    total: bookings.length,
    confirmed: bookings.filter(b => b?.status === 'confirmed').length,
    cancelled: bookings.filter(b => b?.status === 'cancelled').length,
    completed: bookings.filter(b => b?.status === 'completed').length
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader text="Loading all bookings..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8">
        <ErrorMessage message={error} onRetry={loadBookings} />
      </div>
    );
  }

  return (
    <div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-1">Total Bookings</p>
          <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-green-50 rounded-lg border border-green-200 p-4">
          <p className="text-sm text-green-700 mb-1">Confirmed</p>
          <p className="text-3xl font-bold text-green-700">{stats.confirmed}</p>
        </div>
        <div className="bg-red-50 rounded-lg border border-red-200 p-4">
          <p className="text-sm text-red-700 mb-1">Cancelled</p>
          <p className="text-3xl font-bold text-red-700">{stats.cancelled}</p>
        </div>
        <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
          <p className="text-sm text-blue-700 mb-1">Completed</p>
          <p className="text-3xl font-bold text-blue-700">{stats.completed}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, email, or court..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Statuses</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <svg className="w-20 h-20 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No bookings found</h3>
          <p className="text-gray-500">
            {bookings.length === 0 
              ? 'No bookings have been made yet' 
              : 'No bookings match your search criteria'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Court
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Booked On
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBookings.map((booking) => {
                  // Safe data extraction with fallbacks
                  const customerName = booking?.customerName || 'N/A';
                  const customerEmail = booking?.customerEmail || 'N/A';
                  const customerPhone = booking?.customerPhone || 'N/A';
                  const courtName = booking?.court?.name || 'N/A';
                  const courtType = booking?.court?.type || 'N/A';
                  const courtSport = booking?.court?.sport || 'N/A';
                  const totalPrice = booking?.pricing?.totalPrice || 0;
                  const status = booking?.status || 'unknown';
                  
                  return (
                    <tr key={booking._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{customerName}</div>
                          <div className="text-sm text-gray-500">{customerEmail}</div>
                          <div className="text-sm text-gray-500">{customerPhone}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{courtName}</div>
                        <div className="text-sm text-gray-500 capitalize">{courtType} • {courtSport}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {booking?.startTime ? formatDate(booking.startTime) : 'N/A'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {booking?.startTime && booking?.endTime
                            ? `${formatTime(booking.startTime)} - ${formatTime(booking.endTime)}`
                            : 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">
                          ₹{totalPrice.toFixed(2)}
                        </div>
                        {((booking?.equipment?.length > 0) || booking?.coach?.coachId) && (
                          <div className="text-xs text-gray-500 mt-1">
                            {booking?.equipment?.length > 0 && <div>+ Equipment</div>}
                            {booking?.coach?.coachId && <div>+ Coach</div>}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`
                          px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                          ${status === 'confirmed' 
                            ? 'bg-green-100 text-green-800'
                            : status === 'cancelled'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-gray-100 text-gray-800'
                          }
                        `}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {booking?.createdAt ? formatDate(booking.createdAt) : 'N/A'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="mt-4 text-sm text-gray-500 text-center">
        Showing {filteredBookings.length} of {bookings.length} bookings
      </div>
    </div>
  );
};

export default AdminBookings;

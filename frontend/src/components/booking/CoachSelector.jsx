/**
 * CoachSelector Component
 * Select an optional coach for training - WITH AVAILABILITY DISPLAY
 */

import React, { useState, useEffect } from 'react';
import { fetchCoaches } from '../../services/api';
import Loader from '../common/Loader';
import ErrorMessage from '../common/ErrorMessage';

const CoachSelector = ({ selectedCoach, onCoachSelect }) => {
  const [coaches, setCoaches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCoaches();
  }, []);

  const loadCoaches = async () => {
    try {
      setLoading(true);
      const response = await fetchCoaches();
      setCoaches(response.data || []);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCoachClick = (coach) => {
    // Toggle selection - if same coach clicked, deselect
    if (selectedCoach?._id === coach._id) {
      onCoachSelect(null);
    } else {
      onCoachSelect(coach);
    }
  };

  const getDayName = (dayNumber) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayNumber];
  };

  const formatAvailability = (availability) => {
    if (!availability || availability.length === 0) {
      return 'No availability set';
    }

    // Group by day
    const grouped = availability.reduce((acc, slot) => {
      const day = getDayName(slot.dayOfWeek);
      if (!acc[day]) {
        acc[day] = [];
      }
      acc[day].push(`${slot.startTime} - ${slot.endTime}`);
      return acc;
    }, {});

    return grouped;
  };

  if (loading) return <Loader text="Loading coaches..." />;
  if (error) return <ErrorMessage message={error} onRetry={loadCoaches} />;

  if (coaches.length === 0) {
    return (
      <div className="text-center py-6 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No coaches available at the moment</p>
      </div>
    );
  }

  return (
    <div>
      {/* Optional Notice */}
      <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-sm text-blue-800">
          💡 Adding a coach is optional. Click to select or deselect. Check availability schedules below.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {coaches.map((coach) => {
          const availability = formatAvailability(coach.availability);
          const isSelected = selectedCoach?._id === coach._id;
          
          return (
            <div
              key={coach._id}
              onClick={() => handleCoachClick(coach)}
              className={`
                p-4 border-2 rounded-lg cursor-pointer transition-all
                ${isSelected
                  ? 'border-primary-500 bg-primary-50 shadow-md'
                  : 'border-gray-200 hover:border-primary-300 hover:shadow-sm'
                }
              `}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-gray-900 text-lg">{coach.name}</h4>
                    {isSelected && (
                      <span className="px-2 py-0.5 bg-primary-100 text-primary-700 text-xs font-medium rounded-full">
                        Selected
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-primary-600 font-medium mb-2">
                    🏆 {coach.specialization}
                  </p>
                  
                  {coach.bio && (
                    <p className="text-sm text-gray-600 mb-3">{coach.bio}</p>
                  )}

                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                    {coach.experience && (
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {coach.experience} years exp.
                      </span>
                    )}
                    {coach.rating && (
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        {coach.rating}/5.0
                      </span>
                    )}
                  </div>
                </div>

                <div className="ml-4 text-right">
                  <p className="text-2xl font-bold text-primary-600">
                    +₹{coach.pricePerHour}
                  </p>
                  <p className="text-xs text-gray-500">per hour</p>
                </div>
              </div>

              {/* Availability Schedule */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center mb-2">
                  <svg className="w-4 h-4 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h5 className="text-sm font-semibold text-gray-700">Available Hours:</h5>
                </div>
                
                {typeof availability === 'string' ? (
                  <p className="text-xs text-gray-500 ml-6">{availability}</p>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 ml-6">
                    {Object.entries(availability).map(([day, times]) => (
                      <div key={day} className="bg-gray-50 rounded px-2 py-1.5">
                        <p className="text-xs font-medium text-gray-700">{day}</p>
                        {times.map((time, idx) => (
                          <p key={idx} className="text-xs text-gray-600">{time}</p>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {isSelected && (
                <div className="mt-3 flex items-center justify-center text-primary-600 bg-primary-50 rounded-lg py-2">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium">This coach will be added to your booking</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Info footer */}
      <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
        <p className="text-xs text-yellow-800">
          ⚠️ <strong>Note:</strong> Coach availability is checked based on your selected date and time. Make sure your booking time falls within the coach's available hours above.
        </p>
      </div>
    </div>
  );
};

export default CoachSelector;

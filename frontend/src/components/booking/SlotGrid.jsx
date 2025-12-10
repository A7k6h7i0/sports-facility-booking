/**
 * SlotGrid Component
 * Displays available time slots for the selected date
 */

import React from 'react';
import { TIME_SLOTS } from '../../utils/constants';

const SlotGrid = ({ selectedDate, onSlotSelect, loading = false }) => {
  if (!selectedDate) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p className="text-gray-500 text-lg">Please select a date to view available time slots</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
          <span className="ml-3 text-gray-600">Loading time slots...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Available Time Slots</h3>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-500 rounded mr-2" />
            <span className="text-gray-600">Available</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
        {TIME_SLOTS.map((slot, index) => {
          const nextSlot = TIME_SLOTS[index + 1] || '23:00';
          
          return (
            <button
              key={slot}
              onClick={() => onSlotSelect(slot, nextSlot)}
              className="
                px-4 py-3 rounded-lg border-2 border-gray-200
                hover:border-primary-500 hover:bg-primary-50
                transition-all duration-200
                text-sm font-medium text-gray-700
                hover:text-primary-700
                focus:outline-none focus:ring-2 focus:ring-primary-500
              "
            >
              <div className="text-center">
                <div>{slot}</div>
                <div className="text-xs text-gray-500 mt-1">1 hour</div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          💡 <strong>Tip:</strong> Click on a time slot to start your booking. Each slot represents a 1-hour duration.
        </p>
      </div>
    </div>
  );
};

export default SlotGrid;

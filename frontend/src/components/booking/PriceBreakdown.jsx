/**
 * PriceBreakdown Component
 * Displays detailed price calculation
 */

import React, { useState, useEffect } from 'react';
import { getPriceEstimate } from '../../services/api';
import Loader from '../common/Loader';

const PriceBreakdown = ({ bookingData }) => {
  const [pricing, setPricing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (bookingData.courtId && bookingData.startTime && bookingData.endTime) {
      loadPricing();
    }
  }, [bookingData]);

  const loadPricing = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getPriceEstimate(bookingData);
      setPricing(response.data);
    } catch (err) {
      console.error('Pricing error:', err);
      setError('Unable to calculate price');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader text="Calculating price..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-700 text-sm">{error}</p>
      </div>
    );
  }

  if (!pricing) {
    return (
      <div className="bg-gray-50 rounded-lg p-4">
        <p className="text-gray-500 text-sm">Select court and time to see pricing</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
        <svg className="w-5 h-5 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
        Price Breakdown
      </h3>

      <div className="space-y-3">
        {/* Duration */}
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Duration</span>
          <span className="font-medium text-gray-900">
            {pricing.durationHours} hour{pricing.durationHours > 1 ? 's' : ''}
          </span>
        </div>

        {/* Court Price */}
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Court Base Price</span>
          <span className="font-medium text-gray-900">₹{pricing.courtBasePrice.toFixed(2)}</span>
        </div>

        {/* Applied Rules */}
        {pricing.appliedRules && pricing.appliedRules.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs font-medium text-blue-900 mb-2">Applied Pricing Rules:</p>
            {pricing.appliedRules.map((rule, index) => (
              <div key={index} className="text-xs text-blue-800 mb-1">
                • {rule.name} ({rule.multiplier}x)
              </div>
            ))}
            <div className="mt-2 pt-2 border-t border-blue-300 flex justify-between text-sm">
              <span className="text-blue-900">Total Multiplier:</span>
              <span className="font-semibold text-blue-900">{pricing.courtMultiplier.toFixed(2)}x</span>
            </div>
          </div>
        )}

        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Court Final Price</span>
          <span className="font-semibold text-gray-900">₹{pricing.courtPrice.toFixed(2)}</span>
        </div>

        {/* Equipment */}
        {pricing.equipmentPrice > 0 && (
          <div className="border-t border-gray-200 pt-3">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Equipment</span>
              <span className="font-medium text-gray-900">₹{pricing.equipmentPrice.toFixed(2)}</span>
            </div>
            {pricing.equipmentDetails && pricing.equipmentDetails.map((item, index) => (
              <div key={index} className="text-xs text-gray-500 ml-4 mb-1">
                • {item.name} x{item.quantity} - ₹{item.totalPrice.toFixed(2)}
              </div>
            ))}
          </div>
        )}

        {/* Coach */}
        {pricing.coachPrice > 0 && pricing.coachDetails && (
          <div className="border-t border-gray-200 pt-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Coach - {pricing.coachDetails.name}</span>
              <span className="font-medium text-gray-900">₹{pricing.coachPrice.toFixed(2)}</span>
            </div>
          </div>
        )}

        {/* Subtotal */}
        <div className="border-t border-gray-200 pt-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium text-gray-900">₹{pricing.subtotal.toFixed(2)}</span>
          </div>
        </div>

        {/* Tax */}
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Tax (GST 18%)</span>
          <span className="font-medium text-gray-900">₹{pricing.tax.toFixed(2)}</span>
        </div>

        {/* Total */}
        <div className="border-t-2 border-gray-300 pt-3">
          <div className="flex justify-between">
            <span className="text-lg font-semibold text-gray-900">Total Amount</span>
            <span className="text-2xl font-bold text-primary-600">
              ₹{pricing.totalPrice.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Info Note */}
      <div className="mt-4 bg-gray-50 rounded-lg p-3">
        <p className="text-xs text-gray-600">
          💡 Final price includes all applicable charges and taxes
        </p>
      </div>
    </div>
  );
};

export default PriceBreakdown;

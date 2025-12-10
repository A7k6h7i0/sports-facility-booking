/**
 * EquipmentSelector Component
 * Allows users to select equipment with quantity
 */

import React, { useState, useEffect } from 'react';
import { fetchEquipment } from '../../services/api';
import Loader from '../common/Loader';
import ErrorMessage from '../common/ErrorMessage';

const EquipmentSelector = ({ selectedEquipment, onEquipmentChange }) => {
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadEquipment();
  }, []);

  const loadEquipment = async () => {
    try {
      setLoading(true);
      const response = await fetchEquipment();
      setEquipment(response.data || []);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (equipmentId, quantity) => {
    const current = [...selectedEquipment];
    const existingIndex = current.findIndex(e => e.equipmentId === equipmentId);

    if (quantity === 0) {
      // Remove if quantity is 0
      if (existingIndex > -1) {
        current.splice(existingIndex, 1);
      }
    } else {
      // Update or add
      if (existingIndex > -1) {
        current[existingIndex].quantity = quantity;
      } else {
        current.push({ equipmentId, quantity });
      }
    }

    onEquipmentChange(current);
  };

  const getSelectedQuantity = (equipmentId) => {
    const item = selectedEquipment.find(e => e.equipmentId === equipmentId);
    return item ? item.quantity : 0;
  };

  if (loading) return <Loader text="Loading equipment..." />;
  if (error) return <ErrorMessage message={error} onRetry={loadEquipment} />;

  return (
    <div>
      <p className="text-sm text-gray-600 mb-4">
        Select optional equipment to enhance your booking experience
      </p>

      <div className="space-y-3">
        {equipment.length === 0 ? (
          <p className="text-center py-8 text-gray-500">No equipment available</p>
        ) : (
          equipment.map((item) => {
            const selectedQty = getSelectedQuantity(item._id);
            
            return (
              <div
                key={item._id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-primary-300 transition"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-gray-900">{item.name}</h4>
                    <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">
                      {item.category}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-sm font-semibold text-primary-600">
                      ₹{item.pricePerHour}/hour
                    </span>
                    <span className="text-xs text-gray-500">
                      Available: {item.totalQuantity}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 ml-4">
                  <button
                    onClick={() => handleQuantityChange(item._id, Math.max(0, selectedQty - 1))}
                    disabled={selectedQty === 0}
                    className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-primary-500 hover:text-primary-600 disabled:opacity-30 disabled:cursor-not-allowed transition"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>
                  
                  <span className="w-8 text-center font-semibold text-gray-900">
                    {selectedQty}
                  </span>
                  
                  <button
                    onClick={() => handleQuantityChange(item._id, Math.min(item.totalQuantity, selectedQty + 1))}
                    disabled={selectedQty >= item.totalQuantity}
                    className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-primary-500 hover:text-primary-600 disabled:opacity-30 disabled:cursor-not-allowed transition"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {selectedEquipment.length > 0 && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800">
            ✓ {selectedEquipment.length} equipment item(s) selected
          </p>
        </div>
      )}
    </div>
  );
};

export default EquipmentSelector;

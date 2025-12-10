/**
 * ResourceManager Component
 * Toggle courts, equipment, and coaches active/inactive
 */

import React, { useState, useEffect } from 'react';
import { fetchCourts, fetchEquipment, fetchCoaches, toggleCourtStatus, toggleEquipmentStatus, toggleCoachStatus } from '../../services/api';
import Loader from '../common/Loader';

const ResourceManager = () => {
  const [courts, setCourts] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [coaches, setCoaches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('courts');

  useEffect(() => {
    loadResources();
  }, []);

  const loadResources = async () => {
    try {
      setLoading(true);
      const [courtsRes, equipmentRes, coachesRes] = await Promise.all([
        fetchCourts(),
        fetchEquipment(),
        fetchCoaches()
      ]);
      setCourts(courtsRes.data || []);
      setEquipment(equipmentRes.data || []);
      setCoaches(coachesRes.data || []);
    } catch (error) {
      console.error('Error loading resources:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleCourt = async (id) => {
    try {
      await toggleCourtStatus(id);
      await loadResources();
    } catch (error) {
      alert('Error toggling court status');
    }
  };

  const handleToggleEquipment = async (id) => {
    try {
      await toggleEquipmentStatus(id);
      await loadResources();
    } catch (error) {
      alert('Error toggling equipment status');
    }
  };

  const handleToggleCoach = async (id) => {
    try {
      await toggleCoachStatus(id);
      await loadResources();
    } catch (error) {
      alert('Error toggling coach status');
    }
  };

  if (loading) return <Loader text="Loading resources..." />;

  return (
    <div>
      {/* Tabs */}
      <div className="flex space-x-1 mb-6 border-b border-gray-200">
        {[
          { key: 'courts', label: 'Courts', count: courts.length },
          { key: 'equipment', label: 'Equipment', count: equipment.length },
          { key: 'coaches', label: 'Coaches', count: coaches.length }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`
              px-4 py-2 font-medium transition border-b-2
              ${activeTab === tab.key
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
              }
            `}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Courts Tab */}
      {activeTab === 'courts' && (
        <div className="space-y-3">
          {courts.map(court => (
            <div key={court._id} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">{court.name}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-gray-600 capitalize">{court.type} • {court.sport}</span>
                </div>
              </div>
              <button
                onClick={() => handleToggleCourt(court._id)}
                className={`
                  px-4 py-2 rounded-lg font-medium transition
                  ${court.isActive
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }
                `}
              >
                {court.isActive ? 'Active' : 'Inactive'}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Equipment Tab */}
      {activeTab === 'equipment' && (
        <div className="space-y-3">
          {equipment.map(item => (
            <div key={item._id} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">{item.name}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-gray-600">Qty: {item.totalQuantity}</span>
                  <span className="text-sm text-gray-400">•</span>
                  <span className="text-sm text-gray-600">₹{item.pricePerHour}/hr</span>
                </div>
              </div>
              <button
                onClick={() => handleToggleEquipment(item._id)}
                className={`
                  px-4 py-2 rounded-lg font-medium transition
                  ${item.isActive
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }
                `}
              >
                {item.isActive ? 'Active' : 'Inactive'}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Coaches Tab */}
      {activeTab === 'coaches' && (
        <div className="space-y-3">
          {coaches.map(coach => (
            <div key={coach._id} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">{coach.name}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-gray-600">{coach.specialization}</span>
                  <span className="text-sm text-gray-400">•</span>
                  <span className="text-sm text-gray-600">₹{coach.pricePerHour}/hr</span>
                  <span className="text-sm text-gray-400">•</span>
                  <span className="text-sm text-gray-600">⭐ {coach.rating}</span>
                </div>
              </div>
              <button
                onClick={() => handleToggleCoach(coach._id)}
                className={`
                  px-4 py-2 rounded-lg font-medium transition
                  ${coach.isActive
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }
                `}
              >
                {coach.isActive ? 'Active' : 'Inactive'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResourceManager;

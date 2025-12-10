/**
 * CourtSelector Component
 * Allows users to select a court with filtering options
 */

import React, { useState, useEffect } from 'react';
import { fetchCourts } from '../../services/api';
import Loader from '../common/Loader';
import ErrorMessage from '../common/ErrorMessage';

const CourtSelector = ({ selectedCourt, onCourtSelect }) => {
  const [courts, setCourts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [filterSport, setFilterSport] = useState('all');

  useEffect(() => {
    loadCourts();
  }, []);

  const loadCourts = async () => {
    try {
      setLoading(true);
      const response = await fetchCourts();
      setCourts(response.data || []);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Get unique sports for filter
  const sports = ['all', ...new Set(courts.map(c => c.sport))];
  
  // Filter courts
  const filteredCourts = courts.filter(court => {
    const typeMatch = filterType === 'all' || court.type === filterType;
    const sportMatch = filterSport === 'all' || court.sport === filterSport;
    return typeMatch && sportMatch;
  });

  if (loading) return <Loader text="Loading courts..." />;
  if (error) return <ErrorMessage message={error} onRetry={loadCourts} />;

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Court Type</label>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="indoor">Indoor</option>
            <option value="outdoor">Outdoor</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Sport</label>
          <select
            value={filterSport}
            onChange={(e) => setFilterSport(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            {sports.map(sport => (
              <option key={sport} value={sport}>
                {sport === 'all' ? 'All Sports' : sport}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Courts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredCourts.length === 0 ? (
          <div className="col-span-2 text-center py-8 text-gray-500">
            No courts found matching your filters
          </div>
        ) : (
          filteredCourts.map((court) => (
            <div
              key={court._id}
              onClick={() => onCourtSelect(court)}
              className={`
                cursor-pointer rounded-lg border-2 p-4 transition-all
                ${selectedCourt?._id === court._id
                  ? 'border-primary-600 bg-primary-50 shadow-md'
                  : 'border-gray-200 hover:border-primary-300 hover:shadow'
                }
              `}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{court.name}</h4>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`
                      px-2 py-1 text-xs font-medium rounded
                      ${court.type === 'indoor' 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'bg-green-100 text-green-700'
                      }
                    `}>
                      {court.type.toUpperCase()}
                    </span>
                    <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded">
                      {court.sport}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">{court.description}</p>
                  <div className="mt-3">
                    <span className="text-lg font-bold text-primary-600">
                      ₹{court.basePrice}
                    </span>
                    <span className="text-sm text-gray-500">/hour</span>
                  </div>
                </div>
                
                {selectedCourt?._id === court._id && (
                  <div className="flex-shrink-0 ml-4">
                    <svg className="w-6 h-6 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Amenities */}
              {court.amenities && court.amenities.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="flex flex-wrap gap-2">
                    {court.amenities.map((amenity, index) => (
                      <span key={index} className="text-xs text-gray-600 flex items-center">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CourtSelector;

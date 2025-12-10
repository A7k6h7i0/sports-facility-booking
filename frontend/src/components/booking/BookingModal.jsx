/**
 * BookingModal Component
 * Complete booking form with multi-step process
 */

import React, { useState } from 'react';
import Modal from '../common/Modal';
import CourtSelector from './CourtSelector';
import EquipmentSelector from './EquipmentSelector';
import CoachSelector from './CoachSelector';
import PriceBreakdown from './PriceBreakdown';
import Button from '../common/Button';
import { createBooking } from '../../services/api';
import { createDateTime } from '../../utils/dateUtils';
import { useAuth } from '../../context/AuthContext';

const BookingModal = ({ isOpen, onClose, selectedDate, startTime, endTime }) => {
  const [step, setStep] = useState(1);
  const [selectedCourt, setSelectedCourt] = useState(null);
  const [selectedEquipment, setSelectedEquipment] = useState([]);
  const [selectedCoach, setSelectedCoach] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const { user } = useAuth();

  const resetModal = () => {
    setStep(1);
    setSelectedCourt(null);
    setSelectedEquipment([]);
    setSelectedCoach(null);
    setError(null);
    setSuccess(false);
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  const handleNext = () => {
    if (step === 1 && !selectedCourt) {
      setError('Please select a court');
      return;
    }
    setError(null);
    setStep(step + 1);
  };

  const handleBack = () => {
    setError(null);
    setStep(step - 1);
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!selectedCourt) {
    setError('Please select a court');
    return;
  }

  try {
    setLoading(true);
    setError(null);

    const bookingData = {
      courtId: selectedCourt._id,
      startTime: createDateTime(selectedDate, startTime),
      endTime: createDateTime(selectedDate, endTime),
      equipment: selectedEquipment,
      coachId: selectedCoach?._id || null
    };

    const response = await createBooking(bookingData);

    if (response.success) {
      setSuccess(true);
      setTimeout(() => {
        handleClose();
        // Optionally reload page or navigate to bookings
        window.location.href = '/my-bookings';
      }, 2000);
    } else {
      // Display detailed error message
      const errorMessage = response.message || response.error || 'Booking failed';
      setError(errorMessage);
    }
  } catch (err) {
    // Handle error from API
    const errorMessage = err.response?.data?.message || err.message || 'Failed to create booking';
    setError(errorMessage);
  } finally {
    setLoading(false);
  }
};


  const bookingData = {
    courtId: selectedCourt?._id,
    startTime: selectedDate && startTime ? createDateTime(selectedDate, startTime) : null,
    endTime: selectedDate && endTime ? createDateTime(selectedDate, endTime) : null,
    equipment: selectedEquipment,
    coachId: selectedCoach?._id
  };

  if (success) {
    return (
      <Modal isOpen={isOpen} onClose={handleClose} title="Booking Confirmed!" size="md">
        <div className="text-center py-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Booking Successful!</h3>
          <p className="text-gray-600">
            Your booking has been confirmed. Check "My Bookings" for details.
          </p>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Complete Your Booking" size="xl">
      {/* Progress Steps */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          {[
            { num: 1, label: 'Court' },
            { num: 2, label: 'Add-ons' },
            { num: 3, label: 'Details' },
            { num: 4, label: 'Review' }
          ].map((s, index) => (
            <React.Fragment key={s.num}>
              <div className="flex flex-col items-center">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center font-semibold
                  ${step >= s.num 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-gray-200 text-gray-500'}
                `}>
                  {s.num}
                </div>
                <span className="text-xs mt-1 text-gray-600">{s.label}</span>
              </div>
              {index < 3 && (
                <div className={`flex-1 h-1 mx-2 ${step > s.num ? 'bg-primary-600' : 'bg-gray-200'}`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      
{/* Error Display */}

{error && (
  <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
    <div className="flex items-start">
      <svg className="w-5 h-5 text-red-600 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
      </svg>
      <div className="flex-1">
        <h3 className="text-sm font-medium text-red-800 mb-1">Unable to complete booking</h3>
        <p className="text-sm text-red-700">{error}</p>
        
        {/* Helpful suggestions based on error */}
        {error.includes('Coach') && error.includes('not available') && (
          <div className="mt-2 text-xs text-red-600">
            💡 Try selecting a different time or remove the coach selection to proceed without coaching.
          </div>
        )}
        {error.includes('Court') && error.includes('already booked') && (
          <div className="mt-2 text-xs text-red-600">
            💡 This time slot is taken. Please select a different date or time.
          </div>
        )}
      </div>
    </div>
  </div>
)}



      {/* Step Content */}
      <div className="min-h-[400px]">
        {step === 1 && (
          <CourtSelector
            selectedCourt={selectedCourt}
            onCourtSelect={setSelectedCourt}
          />
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Equipment (Optional)</h4>
              <EquipmentSelector
                selectedEquipment={selectedEquipment}
                onEquipmentChange={setSelectedEquipment}
              />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Coach (Optional)</h4>
              <CoachSelector
                selectedCoach={selectedCoach}
                onCoachSelect={setSelectedCoach}
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Confirm Your Details</h4>
            
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium text-gray-900">{user?.name}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium text-gray-900">{user?.email}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium text-gray-900">{user?.phone}</p>
              </div>
            </div>

            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800">
                ℹ️ Your contact details from your account will be used for this booking.
              </p>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Booking Summary</h4>
              
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Court</p>
                  <p className="font-medium text-gray-900">{selectedCourt?.name}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Date & Time</p>
                  <p className="font-medium text-gray-900">
                    {selectedDate?.toLocaleDateString()} • {startTime} - {endTime}
                  </p>
                </div>

                {selectedEquipment.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-500">Equipment</p>
                    <p className="font-medium text-gray-900">
                      {selectedEquipment.length} item(s) selected
                    </p>
                  </div>
                )}

                {selectedCoach && (
                  <div>
                    <p className="text-sm text-gray-500">Coach</p>
                    <p className="font-medium text-gray-900">{selectedCoach.name}</p>
                  </div>
                )}

                <div className="pt-3 border-t border-gray-200">
                  <p className="text-sm text-gray-500">Customer</p>
                  <p className="font-medium text-gray-900">{user?.name}</p>
                  <p className="text-sm text-gray-600">{user?.email}</p>
                  <p className="text-sm text-gray-600">{user?.phone}</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Price Details</h4>
              <PriceBreakdown bookingData={bookingData} />
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6 pt-6 border-t border-gray-200">
        <Button
          onClick={step === 1 ? handleClose : handleBack}
          variant="secondary"
        >
          {step === 1 ? 'Cancel' : 'Back'}
        </Button>

        {step < 4 ? (
          <Button onClick={handleNext}>
            Next
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Confirm Booking'}
          </Button>
        )}
      </div>
    </Modal>
  );
};

export default BookingModal;

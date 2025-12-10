/**
 * PricingRuleEditor Component
 * Form for creating/editing pricing rules
 */

import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { RULE_TYPES, DAYS_OF_WEEK } from '../../utils/constants';

const PricingRuleEditor = ({ isOpen, onClose, onSave, editingRule }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    ruleType: 'custom',
    multiplier: 1,
    priority: 0,
    isActive: true,
    applicableConditions: {
      courtTypes: [],
      daysOfWeek: [],
      timeRanges: [],
      dateRanges: []
    }
  });

  const [timeRange, setTimeRange] = useState({ startTime: '', endTime: '' });

  useEffect(() => {
    if (editingRule) {
      setFormData(editingRule);
    } else {
      resetForm();
    }
  }, [editingRule, isOpen]);

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      ruleType: 'custom',
      multiplier: 1,
      priority: 0,
      isActive: true,
      applicableConditions: {
        courtTypes: [],
        daysOfWeek: [],
        timeRanges: [],
        dateRanges: []
      }
    });
    setTimeRange({ startTime: '', endTime: '' });
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleConditionChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      applicableConditions: {
        ...prev.applicableConditions,
        [field]: value
      }
    }));
  };

  const toggleCourtType = (type) => {
    const current = formData.applicableConditions.courtTypes || [];
    const updated = current.includes(type)
      ? current.filter(t => t !== type)
      : [...current, type];
    handleConditionChange('courtTypes', updated);
  };

  const toggleDay = (day) => {
    const current = formData.applicableConditions.daysOfWeek || [];
    const updated = current.includes(day)
      ? current.filter(d => d !== day)
      : [...current, day];
    handleConditionChange('daysOfWeek', updated);
  };

  const addTimeRange = () => {
    if (timeRange.startTime && timeRange.endTime) {
      const current = formData.applicableConditions.timeRanges || [];
      handleConditionChange('timeRanges', [...current, timeRange]);
      setTimeRange({ startTime: '', endTime: '' });
    }
  };

  const removeTimeRange = (index) => {
    const current = formData.applicableConditions.timeRanges || [];
    handleConditionChange('timeRanges', current.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    resetForm();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingRule ? 'Edit Pricing Rule' : 'Create Pricing Rule'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rule Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rule Type *
            </label>
            <select
              value={formData.ruleType}
              onChange={(e) => handleChange('ruleType', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              required
            >
              {RULE_TYPES.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Multiplier *
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              value={formData.multiplier}
              onChange={(e) => handleChange('multiplier', parseFloat(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              1.5 = 50% increase, 0.8 = 20% discount
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <input
              type="number"
              value={formData.priority}
              onChange={(e) => handleChange('priority', parseInt(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={formData.isActive}
              onChange={(e) => handleChange('isActive', e.target.value === 'true')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
        </div>

        {/* Conditions */}
        <div className="pt-4 border-t border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-4">Applicable Conditions</h4>

          {/* Court Types */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Court Types (optional)
            </label>
            <div className="flex gap-3">
              {['indoor', 'outdoor'].map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => toggleCourtType(type)}
                  className={`
                    px-4 py-2 rounded-lg border-2 capitalize transition
                    ${formData.applicableConditions.courtTypes?.includes(type)
                      ? 'border-primary-600 bg-primary-50 text-primary-700'
                      : 'border-gray-300 text-gray-700 hover:border-primary-300'
                    }
                  `}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Days of Week */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Days of Week (optional)
            </label>
            <div className="flex flex-wrap gap-2">
              {DAYS_OF_WEEK.map(day => (
                <button
                  key={day.value}
                  type="button"
                  onClick={() => toggleDay(day.value)}
                  className={`
                    px-3 py-1.5 rounded-lg border-2 text-sm transition
                    ${formData.applicableConditions.daysOfWeek?.includes(day.value)
                      ? 'border-primary-600 bg-primary-50 text-primary-700'
                      : 'border-gray-300 text-gray-700 hover:border-primary-300'
                    }
                  `}
                >
                  {day.label.substring(0, 3)}
                </button>
              ))}
            </div>
          </div>

          {/* Time Ranges */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Time Ranges (optional)
            </label>
            <div className="flex gap-3 mb-2">
              <input
                type="time"
                value={timeRange.startTime}
                onChange={(e) => setTimeRange({ ...timeRange, startTime: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg"
              />
              <span className="flex items-center text-gray-500">to</span>
              <input
                type="time"
                value={timeRange.endTime}
                onChange={(e) => setTimeRange({ ...timeRange, endTime: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg"
              />
              <Button type="button" onClick={addTimeRange} variant="secondary">
                Add
              </Button>
            </div>
            
            {formData.applicableConditions.timeRanges?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.applicableConditions.timeRanges.map((range, index) => (
                  <div key={index} className="flex items-center gap-2 px-3 py-1.5 bg-purple-50 rounded-lg">
                    <span className="text-sm text-purple-700">
                      {range.startTime} - {range.endTime}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeTimeRange(index)}
                      className="text-purple-600 hover:text-purple-800"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <Button type="button" onClick={onClose} variant="secondary">
            Cancel
          </Button>
          <Button type="submit">
            {editingRule ? 'Update Rule' : 'Create Rule'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default PricingRuleEditor;

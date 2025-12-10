/**
 * RulesList Component
 * Displays all pricing rules with edit/delete options
 */

import React from 'react';
import { RULE_TYPES, DAYS_OF_WEEK } from '../../utils/constants';

const RulesList = ({ rules, onEdit, onDelete, loading }) => {
  const getRuleTypeLabel = (type) => {
    const rule = RULE_TYPES.find(r => r.value === type);
    return rule ? rule.label : type;
  };

  const getDayLabel = (dayNum) => {
    const day = DAYS_OF_WEEK.find(d => d.value === dayNum);
    return day ? day.label.substring(0, 3) : '';
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (rules.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p className="text-gray-500">No pricing rules found</p>
        <p className="text-sm text-gray-400 mt-1">Create your first rule to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {rules.map((rule) => (
        <div
          key={rule._id}
          className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{rule.name}</h3>
                <span className={`
                  px-2 py-1 text-xs font-medium rounded
                  ${rule.isActive 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-gray-100 text-gray-600'}
                `}>
                  {rule.isActive ? 'Active' : 'Inactive'}
                </span>
                <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded">
                  {getRuleTypeLabel(rule.ruleType)}
                </span>
              </div>

              {rule.description && (
                <p className="text-gray-600 text-sm mb-3">{rule.description}</p>
              )}

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-gray-500 mb-1">Multiplier</p>
                  <p className="font-semibold text-primary-600">
                    {rule.multiplier}x
                    {rule.multiplier > 1 && (
                      <span className="text-xs text-red-600 ml-1">
                        (+{((rule.multiplier - 1) * 100).toFixed(0)}%)
                      </span>
                    )}
                    {rule.multiplier < 1 && (
                      <span className="text-xs text-green-600 ml-1">
                        (-{((1 - rule.multiplier) * 100).toFixed(0)}%)
                      </span>
                    )}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500 mb-1">Priority</p>
                  <p className="font-medium text-gray-900">{rule.priority}</p>
                </div>

                {rule.applicableConditions.courtTypes?.length > 0 && (
                  <div>
                    <p className="text-gray-500 mb-1">Court Types</p>
                    <p className="font-medium text-gray-900 capitalize">
                      {rule.applicableConditions.courtTypes.join(', ')}
                    </p>
                  </div>
                )}

                {rule.applicableConditions.daysOfWeek?.length > 0 && (
                  <div>
                    <p className="text-gray-500 mb-1">Days</p>
                    <p className="font-medium text-gray-900">
                      {rule.applicableConditions.daysOfWeek.map(getDayLabel).join(', ')}
                    </p>
                  </div>
                )}
              </div>

              {rule.applicableConditions.timeRanges?.length > 0 && (
                <div className="mt-3">
                  <p className="text-gray-500 text-sm mb-1">Time Ranges</p>
                  <div className="flex flex-wrap gap-2">
                    {rule.applicableConditions.timeRanges.map((range, index) => (
                      <span key={index} className="px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded">
                        {range.startTime} - {range.endTime}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-2 ml-4">
              <button
                onClick={() => onEdit(rule)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                title="Edit rule"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                onClick={() => onDelete(rule._id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                title="Delete rule"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RulesList;

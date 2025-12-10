/**
 * AdminDashboard Component
 * Admin panel for managing pricing rules, resources, and viewing all bookings
 */

import React, { useState, useEffect } from 'react';
import { fetchPricingRules, createPricingRule, updatePricingRule, deletePricingRule } from '../services/api';
import PricingRuleEditor from '../components/admin/PricingRuleEditor';
import RulesList from '../components/admin/RulesList';
import ResourceManager from '../components/admin/ResourceManager';
import AdminBookings from '../components/admin/AdminBookings';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import ErrorMessage from '../components/common/ErrorMessage';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('bookings');
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingRule, setEditingRule] = useState(null);

  const { user } = useAuth();

  useEffect(() => {
    if (activeTab === 'rules') {
      loadRules();
    } else {
      setLoading(false);
    }
  }, [activeTab]);

  const loadRules = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchPricingRules();
      setRules(response.data || []);
    } catch (err) {
      setError(err.message);
      console.error('Error loading rules:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRule = () => {
    setEditingRule(null);
    setIsEditorOpen(true);
  };

  const handleEditRule = (rule) => {
    setEditingRule(rule);
    setIsEditorOpen(true);
  };

  const handleSaveRule = async (ruleData) => {
    try {
      if (editingRule) {
        await updatePricingRule(editingRule._id, ruleData);
      } else {
        await createPricingRule(ruleData);
      }
      setIsEditorOpen(false);
      setEditingRule(null);
      await loadRules();
    } catch (err) {
      alert('Error saving rule: ' + err.message);
    }
  };

  const handleDeleteRule = async (ruleId) => {
    if (!window.confirm('Are you sure you want to delete this rule?')) {
      return;
    }

    try {
      await deletePricingRule(ruleId);
      await loadRules();
    } catch (err) {
      alert('Error deleting rule: ' + err.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          👨‍💼 Admin Dashboard
        </h1>
        <p className="text-gray-600">
          Welcome, {user?.name}! Manage bookings, pricing rules, and resource availability
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between mb-6 border-b border-gray-200">
        <div className="flex space-x-1">
          {[
            { key: 'bookings', label: 'All Bookings', icon: '📅' },
            { key: 'rules', label: 'Pricing Rules', icon: '💰' },
            { key: 'resources', label: 'Resources', icon: '🎾' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`
                flex items-center px-4 py-2 font-medium transition border-b-2
                ${activeTab === tab.key
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
                }
              `}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'rules' && (
          <Button onClick={handleCreateRule}>
            <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Rule
          </Button>
        )}
      </div>

      {/* Content */}
      <div>
        {/* All Bookings Tab */}
        {activeTab === 'bookings' && <AdminBookings />}

        {/* Pricing Rules Tab */}
        {activeTab === 'rules' && (
          <div>
            {loading ? (
              <Loader text="Loading pricing rules..." />
            ) : error ? (
              <ErrorMessage message={error} onRetry={loadRules} />
            ) : (
              <>
                <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 mb-2">💡 How Pricing Rules Work</h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Rules are applied dynamically based on booking time, date, and court type</li>
                    <li>• Multiple rules can stack (multipliers are multiplicative)</li>
                    <li>• Higher priority rules are displayed first</li>
                    <li>• Inactive rules are not applied to new bookings</li>
                  </ul>
                </div>

                <RulesList
                  rules={rules}
                  onEdit={handleEditRule}
                  onDelete={handleDeleteRule}
                  loading={false}
                />
              </>
            )}
          </div>
        )}

        {/* Resources Tab */}
        {activeTab === 'resources' && (
          <div>
            <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">🎾 Resource Management</h3>
              <p className="text-sm text-blue-800">
                Toggle resources active/inactive to control their availability for bookings. Inactive resources won't appear in booking options.
              </p>
            </div>
            
            <ResourceManager />
          </div>
        )}
      </div>

      {/* Pricing Rule Editor Modal */}
      <PricingRuleEditor
        isOpen={isEditorOpen}
        onClose={() => {
          setIsEditorOpen(false);
          setEditingRule(null);
        }}
        onSave={handleSaveRule}
        editingRule={editingRule}
      />
    </div>
  );
};

export default AdminDashboard;

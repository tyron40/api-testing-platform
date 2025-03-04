import React, { useState, useEffect } from 'react';
import { Save, Bell, Clock, Shield, Database, ServerOff } from 'lucide-react';
import api from '../utils/api';

interface SettingsState {
  notifications: {
    emailNotifications: boolean;
    failureAlerts: boolean;
    dailyDigest: boolean;
  };
  scheduling: {
    enableScheduling: boolean;
    interval: string;
    retainResults: number;
  };
  security: {
    apiKeyAuth: boolean;
    basicAuth: boolean;
    oauthEnabled: boolean;
    oauthClientId: string;
    oauthClientSecret: string;
  };
  environment: {
    variables: { key: string; value: string }[];
  };
}

const Settings = () => {
  const [settings, setSettings] = useState<SettingsState>({
    notifications: {
      emailNotifications: true,
      failureAlerts: true,
      dailyDigest: false,
    },
    scheduling: {
      enableScheduling: false,
      interval: 'daily',
      retainResults: 30,
    },
    security: {
      apiKeyAuth: true,
      basicAuth: false,
      oauthEnabled: false,
      oauthClientId: '',
      oauthClientSecret: '',
    },
    environment: {
      variables: [
        { key: 'API_KEY', value: '' },
        { key: 'BASE_URL', value: 'https://api.example.com' },
      ],
    },
  });
  
  const [activeTab, setActiveTab] = useState('notifications');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await api.get('/api/settings');
        setSettings(response.data);
        setError(null);
      } catch (err: any) {
        // Handle the error and set appropriate error message
        const errorMessage = err.isNetworkError 
          ? err.message 
          : 'Failed to load settings. Please try again.';
        setError(errorMessage);
        
        // Keep default settings when server is unavailable
      }
    };

    fetchSettings();
  }, []);

  const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setSettings({
      ...settings,
      notifications: {
        ...settings.notifications,
        [name]: checked,
      },
    });
  };

  const handleSchedulingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const val = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    
    setSettings({
      ...settings,
      scheduling: {
        ...settings.scheduling,
        [name]: val,
      },
    });
  };

  const handleSecurityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    
    setSettings({
      ...settings,
      security: {
        ...settings.security,
        [name]: val,
      },
    });
  };

  const handleEnvironmentVarChange = (index: number, field: 'key' | 'value', value: string) => {
    const newVars = [...settings.environment.variables];
    newVars[index] = { ...newVars[index], [field]: value };
    
    setSettings({
      ...settings,
      environment: {
        ...settings.environment,
        variables: newVars,
      },
    });
  };

  const addEnvironmentVar = () => {
    setSettings({
      ...settings,
      environment: {
        ...settings.environment,
        variables: [...settings.environment.variables, { key: '', value: '' }],
      },
    });
  };

  const removeEnvironmentVar = (index: number) => {
    const newVars = [...settings.environment.variables];
    newVars.splice(index, 1);
    
    setSettings({
      ...settings,
      environment: {
        ...settings.environment,
        variables: newVars,
      },
    });
  };

  const saveSettings = async () => {
    setSaving(true);
    setError(null);
    try {
      await api.put('/api/settings', settings);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      // Handle the error and set appropriate error message
      const errorMessage = err.isNetworkError 
        ? err.message 
        : 'Failed to save settings. Please try again.';
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
        <button
          onClick={saveSettings}
          disabled={saving}
          className={`flex items-center px-4 py-2 rounded-md ${
            saving ? 'bg-gray-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 text-white'
          }`}
        >
          {saving ? (
            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
          ) : (
            <Save className="h-5 w-5 mr-2" />
          )}
          Save Settings
        </button>
      </div>

      {saveSuccess && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
          Settings saved successfully!
        </div>
      )}

      {error && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex items-center">
            <ServerOff className="h-5 w-5 text-yellow-400 mr-2" />
            <p className="text-yellow-700">{error}</p>
          </div>
          <p className="text-sm text-yellow-600 mt-2">
            {error.includes('server is currently unavailable') ? 
              'Using local settings for preview purposes. Start the server to save changes.' : 
              'Please check your connection and try again.'}
          </p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="flex border-b border-gray-200">
          <button
            className={`px-6 py-3 font-medium ${
              activeTab === 'notifications'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('notifications')}
          >
            <div className="flex items-center">
              <Bell className="h-5 w-5 mr-2" />
              Notifications
            </div>
          </button>
          <button
            className={`px-6 py-3 font-medium ${
              activeTab === 'scheduling'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('scheduling')}
          >
            <div className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Scheduling
            </div>
          </button>
          <button
            className={`px-6 py-3 font-medium ${
              activeTab === 'security'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('security')}
          >
            <div className="flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Security
            </div>
          </button>
          <button
            className={`px-6 py-3 font-medium ${
              activeTab === 'environment'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('environment')}
          >
            <div className="flex items-center">
              <Database className="h-5 w-5 mr-2" />
              Environment
            </div>
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'notifications' && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Notification Settings</h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="emailNotifications"
                    name="emailNotifications"
                    checked={settings.notifications.emailNotifications}
                    onChange={handleNotificationChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="emailNotifications" className="ml-2 block text-sm text-gray-700">
                    Enable email notifications
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="failureAlerts"
                    name="failureAlerts"
                    checked={settings.notifications.failureAlerts}
                    onChange={handleNotificationChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="failureAlerts" className="ml-2 block text-sm text-gray-700">
                    Send alerts on test failures
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="dailyDigest"
                    name="dailyDigest"
                    checked={settings.notifications.dailyDigest}
                    onChange={handleNotificationChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="dailyDigest" className="ml-2 block text-sm text-gray-700">
                    Send daily test summary digest
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'scheduling' && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Test Scheduling</h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="enableScheduling"
                    name="enableScheduling"
                    checked={settings.scheduling.enableScheduling}
                    onChange={handleSchedulingChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="enableScheduling" className="ml-2 block text-sm text-gray-700">
                    Enable scheduled test runs
                  </label>
                </div>
                
                <div>
                  <label htmlFor="interval" className="block text-sm font-medium text-gray-700 mb-1">
                    Run tests
                  </label>
                  <select
                    id="interval"
                    name="interval"
                    value={settings.scheduling.interval}
                    onChange={handleSchedulingChange}
                    disabled={!settings.scheduling.enableScheduling}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 disabled:text-gray-500"
                  >
                    <option value="hourly">Hourly</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="retainResults" className="block text-sm font-medium text-gray-700 mb-1">
                    Retain test results for (days)
                  </label>
                  <input
                    type="number"
                    id="retainResults"
                    name="retainResults"
                    value={settings.scheduling.retainResults}
                    onChange={handleSchedulingChange}
                    min="1"
                    max="365"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Security Settings</h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="apiKeyAuth"
                    name="apiKeyAuth"
                    checked={settings.security.apiKeyAuth}
                    onChange={handleSecurityChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="apiKeyAuth" className="ml-2 block text-sm text-gray-700">
                    Enable API Key Authentication
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="basicAuth"
                    name="basicAuth"
                    checked={settings.security.basicAuth}
                    onChange={handleSecurityChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="basicAuth" className="ml-2 block text-sm text-gray-700">
                    Enable Basic Authentication
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="oauthEnabled"
                    name="oauthEnabled"
                    checked={settings.security.oauthEnabled}
                    onChange={handleSecurityChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="oauthEnabled" className="ml-2 block text-sm text-gray-700">
                    Enable OAuth 2.0
                  </label>
                </div>
                
                {settings.security.oauthEnabled && (
                  <div className="pl-6 space-y-4">
                    <div>
                      <label htmlFor="oauthClientId" className="block text-sm font-medium text-gray-700 mb-1">
                        OAuth Client ID
                      </label>
                      <input
                        type="text"
                        id="oauthClientId"
                        name="oauthClientId"
                        value={settings.security.oauthClientId}
                        onChange={handleSecurityChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="oauthClientSecret" className="block text-sm font-medium text-gray-700 mb-1">
                        OAuth Client Secret
                      </label>
                      <input
                        type="password"
                        id="oauthClientSecret"
                        name="oauthClientSecret"
                        value={settings.security.oauthClientSecret}
                        onChange={handleSecurityChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'environment' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Environment Variables</h2>
                <button
                  onClick={addEnvironmentVar}
                  className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                >
                  + Add Variable
                </button>
              </div>
              
              <div className="space-y-3">
                {settings.environment.variables.map((variable, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={variable.key}
                      onChange={(e) => handleEnvironmentVarChange(index, 'key', e.target.value)}
                      placeholder="Variable name"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <input
                      type="text"
                      value={variable.value}
                      onChange={(e) => handleEnvironmentVarChange(index, 'value', e.target.value)}
                      placeholder="Value"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                      onClick={() => removeEnvironmentVar(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
              
              <p className="mt-4 text-sm text-gray-500">
                Environment variables are securely stored and can be referenced in your API tests.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
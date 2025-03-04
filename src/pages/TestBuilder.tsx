import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, Plus, Trash2, Code, Database, Wand2, ServerOff } from 'lucide-react';
import api from '../utils/api';

interface TestStep {
  id: string;
  name: string;
  method: string;
  endpoint: string;
  headers: { key: string; value: string }[];
  body: string;
  assertions: { type: string; target: string; value: string }[];
}

const TestBuilder = () => {
  const navigate = useNavigate();
  const [testSuite, setTestSuite] = useState({
    name: '',
    description: '',
    baseUrl: '',
    apiType: 'REST',
    environment: 'development'
  });
  
  const [steps, setSteps] = useState<TestStep[]>([
    {
      id: '1',
      name: 'Initial Request',
      method: 'GET',
      endpoint: '/api/resource',
      headers: [{ key: 'Content-Type', value: 'application/json' }],
      body: '',
      assertions: [
        { type: 'status', target: 'status', value: '200' }
      ]
    }
  ]);
  
  const [currentStep, setCurrentStep] = useState<string>('1');
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTestSuite({ ...testSuite, [name]: value });
  };

  const handleStepChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>, stepId: string) => {
    const { name, value } = e.target;
    setSteps(steps.map(step => 
      step.id === stepId ? { ...step, [name]: value } : step
    ));
  };

  const handleHeaderChange = (stepId: string, index: number, field: 'key' | 'value', value: string) => {
    setSteps(steps.map(step => {
      if (step.id === stepId) {
        const newHeaders = [...step.headers];
        newHeaders[index] = { ...newHeaders[index], [field]: value };
        return { ...step, headers: newHeaders };
      }
      return step;
    }));
  };

  const addHeader = (stepId: string) => {
    setSteps(steps.map(step => {
      if (step.id === stepId) {
        return { ...step, headers: [...step.headers, { key: '', value: '' }] };
      }
      return step;
    }));
  };

  const removeHeader = (stepId: string, index: number) => {
    setSteps(steps.map(step => {
      if (step.id === stepId) {
        const newHeaders = [...step.headers];
        newHeaders.splice(index, 1);
        return { ...step, headers: newHeaders };
      }
      return step;
    }));
  };

  const handleAssertionChange = (stepId: string, index: number, field: 'type' | 'target' | 'value', value: string) => {
    setSteps(steps.map(step => {
      if (step.id === stepId) {
        const newAssertions = [...step.assertions];
        newAssertions[index] = { ...newAssertions[index], [field]: value };
        return { ...step, assertions: newAssertions };
      }
      return step;
    }));
  };

  const addAssertion = (stepId: string) => {
    setSteps(steps.map(step => {
      if (step.id === stepId) {
        return { ...step, assertions: [...step.assertions, { type: 'status', target: '', value: '' }] };
      }
      return step;
    }));
  };

  const removeAssertion = (stepId: string, index: number) => {
    setSteps(steps.map(step => {
      if (step.id === stepId) {
        const newAssertions = [...step.assertions];
        newAssertions.splice(index, 1);
        return { ...step, assertions: newAssertions };
      }
      return step;
    }));
  };

  const addStep = () => {
    const newId = (parseInt(steps[steps.length - 1].id) + 1).toString();
    const newStep: TestStep = {
      id: newId,
      name: `Step ${newId}`,
      method: 'GET',
      endpoint: '/api/resource',
      headers: [{ key: 'Content-Type', value: 'application/json' }],
      body: '',
      assertions: [
        { type: 'status', target: 'status', value: '200' }
      ]
    };
    setSteps([...steps, newStep]);
    setCurrentStep(newId);
  };

  const removeStep = (id: string) => {
    if (steps.length === 1) {
      return; // Don't remove the last step
    }
    
    const newSteps = steps.filter(step => step.id !== id);
    setSteps(newSteps);
    
    // If we're removing the current step, select another one
    if (currentStep === id) {
      setCurrentStep(newSteps[0].id);
    }
  };

  const generateTests = async () => {
    setGenerating(true);
    setError(null);
    try {
      const response = await api.post('/api/test-generator/generate', {
        baseUrl: testSuite.baseUrl,
        apiType: testSuite.apiType
      });
      
      // Update with generated tests
      setSteps(response.data.steps.map((step: any, index: number) => ({
        ...step,
        id: (index + 1).toString()
      })));
      
      setCurrentStep('1');
    } catch (err: any) {
      // Handle the error and set appropriate error message
      const errorMessage = err.isNetworkError 
        ? err.message 
        : 'Failed to generate tests. Please try again.';
      setError(errorMessage);
      
      // Generate some demo tests if server is unavailable
      if (err.isNetworkError) {
        const demoSteps = [
          {
            id: '1',
            name: 'Get All Items',
            method: 'GET',
            endpoint: '/api/items',
            headers: [{ key: 'Content-Type', value: 'application/json' }],
            body: '',
            assertions: [
              { type: 'status', target: 'status', value: '200' },
              { type: 'responseTime', target: 'time', value: '1000' }
            ]
          },
          {
            id: '2',
            name: 'Get Item by ID',
            method: 'GET',
            endpoint: '/api/items/1',
            headers: [{ key: 'Content-Type', value: 'application/json' }],
            body: '',
            assertions: [
              { type: 'status', target: 'status', value: '200' },
              { type: 'json', target: '$.id', value: '1' }
            ]
          },
          {
            id: '3',
            name: 'Create Item',
            method: 'POST',
            endpoint: '/api/items',
            headers: [{ key: 'Content-Type', value: 'application/json' }],
            body: '{\n  "name": "New Item",\n  "description": "This is a new item"\n}',
            assertions: [
              { type: 'status', target: 'status', value: '201' },
              { type: 'json', target: '$.name', value: 'New Item' }
            ]
          }
        ];
        
        setSteps(demoSteps);
        setCurrentStep('1');
      }
    } finally {
      setGenerating(false);
    }
  };

  const saveTestSuite = async () => {
    setSaving(true);
    setError(null);
    try {
      await api.post('/api/test-suites', {
        ...testSuite,
        steps
      });
      navigate('/');
    } catch (err: any) {
      // Handle the error and set appropriate error message
      const errorMessage = err.isNetworkError 
        ? err.message 
        : 'Failed to save test suite. Please try again.';
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const currentStepData = steps.find(step => step.id === currentStep);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Test Builder</h1>
        <div className="flex space-x-4">
          <button
            onClick={generateTests}
            disabled={generating || !testSuite.baseUrl}
            className={`flex items-center px-4 py-2 rounded-md ${
              generating || !testSuite.baseUrl
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-purple-600 hover:bg-purple-700 text-white'
            }`}
          >
            {generating ? (
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
            ) : (
              <Wand2 className="h-5 w-5 mr-2" />
            )}
            Auto Generate
          </button>
          <button
            onClick={saveTestSuite}
            disabled={saving || !testSuite.name}
            className={`flex items-center px-4 py-2 rounded-md ${
              saving || !testSuite.name
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
          >
            {saving ? (
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
            ) : (
              <Save className="h-5 w-5 mr-2" />
            )}
            Save Test Suite
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex items-center">
            <ServerOff className="h-5 w-5 text-yellow-400 mr-2" />
            <p className="text-yellow-700">{error}</p>
          </div>
          <p className="text-sm text-yellow-600 mt-2">
            {error.includes('server is currently unavailable') ? 
              'Using demo data for preview purposes. Start the server to see actual data.' : 
              'Please check your connection and try again.'}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Test Suite Configuration</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={testSuite.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="My API Test Suite"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={testSuite.description}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Description of what this test suite covers"
                  rows={3}
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Base URL</label>
                <input
                  type="text"
                  name="baseUrl"
                  value={testSuite.baseUrl}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="https://api.example.com"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">API Type</label>
                  <select
                    name="apiType"
                    value={testSuite.apiType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="REST">REST</option>
                    <option value="GraphQL">GraphQL</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Environment</label>
                  <select
                    name="environment"
                    value={testSuite.environment}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="development">Development</option>
                    <option value="staging">Staging</option>
                    <option value="production">Production</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Test Steps</h2>
              <button
                onClick={addStep}
                className="p-1 text-indigo-600 hover:text-indigo-800 rounded-full hover:bg-indigo-50"
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-2">
              {steps.map((step) => (
                <div
                  key={step.id}
                  onClick={() => setCurrentStep(step.id)}
                  className={`flex justify-between items-center p-3 rounded-md cursor-pointer ${
                    currentStep === step.id ? 'bg-indigo-50 border border-indigo-200' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`p-2 rounded-full mr-3 ${
                      step.method === 'GET' ? 'bg-green-100 text-green-700' :
                      step.method === 'POST' ? 'bg-blue-100 text-blue-700' :
                      step.method === 'PUT' ? 'bg-yellow-100 text-yellow-700' :
                      step.method === 'DELETE' ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      <Code className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{step.name}</p>
                      <p className="text-sm text-gray-500">{step.method} {step.endpoint}</p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeStep(step.id);
                    }}
                    className="p-1 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          {currentStepData && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4">Step Configuration</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Step Name</label>
                  <input
                    type="text"
                    name="name"
                    value={currentStepData.name}
                    onChange={(e) => handleStepChange(e, currentStepData.id)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">HTTP Method</label>
                  <select
                    name="method"
                    value={currentStepData.method}
                    onChange={(e) => handleStepChange(e, currentStepData.id)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                    <option value="PUT">PUT</option>
                    <option value="PATCH">PATCH</option>
                    <option value="DELETE">DELETE</option>
                  </select>
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Endpoint</label>
                <input
                  type="text"
                  name="endpoint"
                  value={currentStepData.endpoint}
                  onChange={(e) => handleStepChange(e, currentStepData.id)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="/api/resource"
                />
              </div>
              
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">Headers</label>
                  <button
                    onClick={() => addHeader(currentStepData.id)}
                    className="p-1 text-indigo-600 hover:text-indigo-800 rounded-full hover:bg-indigo-50"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                {currentStepData.headers.map((header, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      value={header.key}
                      onChange={(e) => handleHeaderChange(currentStepData.id, index, 'key', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Header name"
                    />
                    <input
                      type="text"
                      value={header.value}
                      onChange={(e) => handleHeaderChange(currentStepData.id, index, 'value', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Value"
                    />
                    <button
                      onClick={() => removeHeader(currentStepData .id, index)}
                      className="p-1 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
              
              {(currentStepData.method === 'POST' || currentStepData.method === 'PUT' || currentStepData.method === 'PATCH') && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Request Body</label>
                  <textarea
                    name="body"
                    value={currentStepData.body}
                    onChange={(e) => handleStepChange(e, currentStepData.id)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                    placeholder="{}"
                    rows={6}
                  ></textarea>
                </div>
              )}
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">Assertions</label>
                  <button
                    onClick={() => addAssertion(currentStepData.id)}
                    className="p-1 text-indigo-600 hover:text-indigo-800 rounded-full hover:bg-indigo-50"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                {currentStepData.assertions.map((assertion, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <select
                      value={assertion.type}
                      onChange={(e) => handleAssertionChange(currentStepData.id, index, 'type', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="status">Status</option>
                      <option value="json">JSON Path</option>
                      <option value="header">Header</option>
                      <option value="responseTime">Response Time</option>
                    </select>
                    <input
                      type="text"
                      value={assertion.target}
                      onChange={(e) => handleAssertionChange(currentStepData.id, index, 'target', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder={assertion.type === 'json' ? "$.data.id" : assertion.type === 'header' ? "Content-Type" : ""}
                    />
                    <input
                      type="text"
                      value={assertion.value}
                      onChange={(e) => handleAssertionChange(currentStepData.id, index, 'value', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Expected value"
                    />
                    <button
                      onClick={() => removeAssertion(currentStepData.id, index)}
                      className="p-1 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestBuilder;
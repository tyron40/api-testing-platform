import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, XCircle, Clock, ChevronDown, ChevronUp, Calendar, BarChart2, ServerOff } from 'lucide-react';
import api from '../utils/api';

interface TestResult {
  _id: string;
  testSuiteId: string;
  testSuiteName: string;
  status: 'passed' | 'failed' | 'pending';
  startTime: string;
  endTime: string;
  duration: number;
  environment: string;
  steps: {
    name: string;
    status: 'passed' | 'failed';
    duration: number;
    request: {
      method: string;
      url: string;
    };
    response: {
      status: number;
      body: string;
    };
    assertions: {
      name: string;
      passed: boolean;
      expected: string;
      actual: string;
    }[];
  }[];
}

const TestResults = () => {
  const [results, setResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedResult, setExpandedResult] = useState<string | null>(null);
  const [expandedStep, setExpandedStep] = useState<string | null>(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await api.get('/api/test-results');
        setResults(response.data);
        setError(null);
      } catch (err: any) {
        // Handle the error and set appropriate error message
        const errorMessage = err.isNetworkError 
          ? err.message 
          : 'Failed to load test results. Please try again.';
        setError(errorMessage);
        
        // Set mock data for demo purposes when server is unavailable
        setResults([
          {
            _id: 'demo-1',
            testSuiteId: 'demo-suite-1',
            testSuiteName: 'User API Tests (Demo)',
            status: 'passed',
            startTime: new Date(Date.now() - 3600000).toISOString(),
            endTime: new Date(Date.now() - 3590000).toISOString(),
            duration: 10000,
            environment: 'development',
            steps: [
              {
                name: 'Get Users',
                status: 'passed',
                duration: 5000,
                request: {
                  method: 'GET',
                  url: 'https://api.example.com/api/users'
                },
                response: {
                  status: 200,
                  body: '{"users":[{"id":1,"name":"John Doe"},{"id":2,"name":"Jane Smith"}]}'
                },
                assertions: [
                  {
                    name: 'Status Code is 200',
                    passed: true,
                    expected: '200',
                    actual: '200'
                  }
                ]
              }
            ]
          },
          {
            _id: 'demo-2',
            testSuiteId: 'demo-suite-2',
            testSuiteName: 'Product API Tests (Demo)',
            status: 'failed',
            startTime: new Date(Date.now() - 7200000).toISOString(),
            endTime: new Date(Date.now() - 7190000).toISOString(),
            duration: 10000,
            environment: 'development',
            steps: [
              {
                name: 'Get Products',
                status: 'passed',
                duration: 3000,
                request: {
                  method: 'GET',
                  url: 'https://api.example.com/api/products'
                },
                response: {
                  status: 200,
                  body: '{"products":[{"id":1,"name":"Product 1"},{"id":2,"name":"Product 2"}]}'
                },
                assertions: [
                  {
                    name: 'Status Code is 200',
                    passed: true,
                    expected: '200',
                    actual: '200'
                  }
                ]
              },
              {
                name: 'Create Product',
                status: 'failed',
                duration: 7000,
                request: {
                  method: 'POST',
                  url: 'https://api.example.com/api/products'
                },
                response: {
                  status: 400,
                  body: '{"error":"Invalid product data"}'
                },
                assertions: [
                  {
                    name: 'Status Code is 201',
                    passed: false,
                    expected: '201',
                    actual: '400'
                  }
                ]
              }
            ]
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  const toggleResult = (id: string) => {
    setExpandedResult(expandedResult === id ? null : id);
    setExpandedStep(null);
  };

  const toggleStep = (id: string) => {
    setExpandedStep(expandedStep === id ? null : id);
  };

  const filteredResults = filter === 'all' 
    ? results 
    : results.filter(result => result.status === filter);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Test Results</h1>
        <div className="flex space-x-2">
          <button 
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-md ${
              filter === 'all' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All
          </button>
          <button 
            onClick={() => setFilter('passed')}
            className={`px-4 py-2 rounded-md ${
              filter === 'passed' 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Passed
          </button>
          <button 
            onClick={() => setFilter('failed')}
            className={`px-4 py-2 rounded-md ${
              filter === 'failed' 
                ? 'bg-red-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Failed
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

      {filteredResults.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <BarChart2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">No test results found</h2>
          <p className="text-gray-500 mb-6">Run some tests to see results here.</p>
          <Link 
            to="/test-builder" 
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md"
          >
            Create Test Suite
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredResults.map((result) => (
            <div key={result._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div 
                className="px-6 py-4 flex items-center justify-between cursor-pointer"
                onClick={() => toggleResult(result._id)}
              >
                <div className="flex items-center">
                  {result.status === 'passed' ? (
                    <CheckCircle className="h-6 w-6 text-green-500 mr-3" />
                  ) : result.status === 'failed' ? (
                    <XCircle className="h-6 w-6 text-red-500 mr-3" />
                  ) : (
                    <Clock className="h-6 w-6 text-yellow-500 mr-3" />
                  )}
                  <div>
                    <h3 className="text-lg font-medium text-gray-800">{result.testSuiteName}</h3>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{new Date(result.startTime).toLocaleString()}</span>
                      <span className="mx-2">•</span>
                      <span>{result.environment}</span>
                      <span className="mx-2">•</span>
                      <span>{(result.duration / 1000).toFixed(2)}s</span>
                    </div>
                  </div>
                </div>
                {expandedResult === result._id ? (
                  <ChevronUp className="h-5 w-5 text-gray-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                )}
              </div>
              
              {expandedResult === result._id && (
                <div className="px-6 py-4 border-t border-gray-200">
                  <h4 className="font-medium text-gray-700 mb-3">Test Steps</h4>
                  <div className="space-y-3">
                    {result.steps.map((step, stepIndex) => (
                      <div key={stepIndex} className="border border-gray-200 rounded-md overflow-hidden">
                        <div 
                          className={`px-4 py-3 flex items-center justify-between cursor-pointer ${
                            step.status === 'passed' ? 'bg-green-50' : 'bg-red-50'
                          }`}
                          onClick={() => toggleStep(`${result._id}-${stepIndex}`)}
                        >
                          <div className="flex items-center">
                            {step.status === 'passed' ? (
                              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                            ) : (
                              <XCircle className="h-5 w-5 text-red-500 mr-2" />
                            )}
                            <div>
                              <p className="font-medium text-gray-800">{step.name}</p>
                              <p className="text-sm text-gray-500">
                                {step.request.method} {step.request.url} • {(step.duration / 1000).toFixed(2)}s
                              </p>
                            </div>
                          </div>
                          {expandedStep === `${result._id}-${stepIndex}` ? (
                            <ChevronUp className="h-4 w-4 text-gray-400" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-gray-400" />
                          )}
                        </div>
                        
                        {expandedStep === `${result._id}-${stepIndex}` && (
                          <div className="px-4 py-3 bg-white">
                            <div className="mb-4">
                              <h5 className="text-sm font-medium text-gray-700 mb-2">Response</h5>
                              <div className="bg-gray-100 p-3 rounded-md">
                                <p className="text-sm text-gray-600 mb-1">Status: {step.response.status}</p>
                                <pre className="text-xs overflow-x-auto">{step.response.body}</pre>
                              </div>
                            </div>
                            
                            <div>
                              <h5 className="text-sm font-medium text-gray-700 mb-2">Assertions</h5>
                              <div className="space-y-2">
                                {step.assertions.map((assertion, assertionIndex) => (
                                  <div 
                                    key={assertionIndex} 
                                    className={`p-2 rounded-md text-sm ${
                                      assertion.passed ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                                    }`}
                                  >
                                    <div className="flex items-center">
                                      {assertion.passed ? (
                                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                      ) : (
                                        <XCircle className="h-4 w-4 text-red-500 mr-2" />
                                      )}
                                      <span className="font-medium">{assertion.name}</span>
                                    </div>
                                    <div className="mt-1 pl-6 text-xs">
                                      <p>Expected: <span className="font-mono">{assertion.expected}</span></p>
                                      <p>Actual: <span className="font-mono">{assertion.actual}</span></p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TestResults;
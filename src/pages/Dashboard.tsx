import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play, AlertCircle, CheckCircle, Clock, Plus, ServerOff } from 'lucide-react';
import api from '../utils/api';

interface TestSuite {
  _id: string;
  name: string;
  description: string;
  apiType: 'REST' | 'GraphQL';
  lastRun: string;
  status: 'passed' | 'failed' | 'pending';
  passRate: number;
}

const Dashboard = () => {
  const [testSuites, setTestSuites] = useState<TestSuite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    passed: 0,
    failed: 0,
    pending: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/api/test-suites');
        setTestSuites(response.data);
        
        // Calculate stats
        const total = response.data.length;
        const passed = response.data.filter((suite: TestSuite) => suite.status === 'passed').length;
        const failed = response.data.filter((suite: TestSuite) => suite.status === 'failed').length;
        const pending = response.data.filter((suite: TestSuite) => suite.status === 'pending').length;
        
        setStats({ total, passed, failed, pending });
        setError(null);
      } catch (err: any) {
        // Handle the error and set appropriate error message
        const errorMessage = err.isNetworkError 
          ? err.message 
          : 'Failed to load test suites. Please try again.';
        setError(errorMessage);
        
        // Set mock data for demo purposes when server is unavailable
        setTestSuites([
          {
            _id: 'demo-1',
            name: 'User API Tests (Demo)',
            description: 'Tests for user management endpoints',
            apiType: 'REST',
            lastRun: new Date().toISOString(),
            status: 'passed',
            passRate: 100
          },
          {
            _id: 'demo-2',
            name: 'Product API Tests (Demo)',
            description: 'Tests for product catalog endpoints',
            apiType: 'REST',
            lastRun: new Date().toISOString(),
            status: 'failed',
            passRate: 75
          }
        ]);
        
        // Calculate stats for demo data
        setStats({
          total: 2,
          passed: 1,
          failed: 1,
          pending: 0
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const runTest = async (id: string) => {
    try {
      await api.post(`/api/test-suites/${id}/run`);
      
      // Refresh data
      const response = await api.get('/api/test-suites');
      setTestSuites(response.data);
      setError(null);
    } catch (err: any) {
      // Handle the error
      const errorMessage = err.isNetworkError 
        ? err.message 
        : 'Failed to run test. Please try again.';
      setError(errorMessage);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <Link 
          to="/test-builder" 
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          New Test Suite
        </Link>
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

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Test Suites" value={stats.total} color="bg-blue-500" />
        <StatCard title="Passed" value={stats.passed} color="bg-green-500" icon={<CheckCircle className="h-6 w-6" />} />
        <StatCard title="Failed" value={stats.failed} color="bg-red-500" icon={<AlertCircle className="h-6 w-6" />} />
        <StatCard title="Pending" value={stats.pending} color="bg-yellow-500" icon={<Clock className="h-6 w-6" />} />
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Recent Test Suites</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {testSuites.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-500">
              No test suites found. Create your first test suite to get started.
            </div>
          ) : (
            testSuites.map((suite) => (
              <div key={suite._id} className="px-6 py-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-800">{suite.name}</h3>
                  <p className="text-sm text-gray-500">{suite.description}</p>
                  <div className="flex items-center mt-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      suite.apiType === 'REST' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                    }`}>
                      {suite.apiType}
                    </span>
                    <span className="mx-2 text-gray-400">•</span>
                    <span className="text-sm text-gray-500">
                      Last run: {new Date(suite.lastRun).toLocaleString()}
                    </span>
                    <span className="mx-2 text-gray-400">•</span>
                    <span className={`text-sm ${
                      suite.status === 'passed' ? 'text-green-500' : 
                      suite.status === 'failed' ? 'text-red-500' : 'text-yellow-500'
                    }`}>
                      {suite.status.charAt(0).toUpperCase() + suite.status.slice(1)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-24 bg-gray-200 rounded-full h-2.5">
                    <div 
                      className={`h-2.5 rounded-full ${
                        suite.passRate >= 80 ? 'bg-green-500' : 
                        suite.passRate >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${suite.passRate}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-700">{suite.passRate}%</span>
                  <button 
                    onClick={() => runTest(suite._id)}
                    className="p-2 text-indigo-600 hover:text-indigo-800 rounded-full hover:bg-indigo-50"
                  >
                    <Play className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ 
  title, 
  value, 
  color, 
  icon 
}: { 
  title: string; 
  value: number; 
  color: string; 
  icon?: React.ReactNode 
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center">
        {icon && (
          <div className={`${color} text-white p-3 rounded-full mr-4`}>
            {icon}
          </div>
        )}
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-3xl font-bold text-gray-800">{value}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
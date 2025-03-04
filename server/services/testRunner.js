import axios from 'axios';
import TestSuite from '../models/TestSuite.js';
import TestResult from '../models/TestResult.js';
import { logger } from '../utils/logger.js';

export const runTestSuite = async (testSuiteId, userId) => {
  try {
    // For demo purposes, we'll simulate running tests
    // In a real app, you would fetch the test suite from MongoDB and run the tests
    
    logger.info(`Running test suite ${testSuiteId} for user ${userId}`);
    
    // Simulate test execution
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update test suite status
    // In a real app, you would update the test suite in MongoDB
    
    logger.info(`Test suite ${testSuiteId} completed`);
    
    return true;
  } catch (error) {
    logger.error(`Error running test suite ${testSuiteId}:`, error);
    throw error;
  }
};

export const executeTestStep = async (step, baseUrl, environment) => {
  try {
    const startTime = Date.now();
    
    // Prepare request
    const url = `${baseUrl}${step.endpoint}`;
    const headers = {};
    
    // Convert headers array to object
    step.headers.forEach(header => {
      headers[header.key] = header.value;
    });
    
    // Execute request
    const response = await axios({
      method: step.method,
      url,
      headers,
      data: step.body ? JSON.parse(step.body) : undefined,
      validateStatus: () => true // Don't throw on error status codes
    });
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    // Evaluate assertions
    const assertions = step.assertions.map(assertion => {
      let passed = false;
      let actual = '';
      
      switch (assertion.type) {
        case 'status':
          actual = response.status.toString();
          passed = actual === assertion.value;
          break;
        case 'json':
          // Simple JSON path evaluation
          try {
            const jsonData = response.data;
            const path = assertion.target.split('.');
            let value = jsonData;
            
            for (const key of path) {
              if (key.startsWith('$')) continue; // Skip root
              value = value[key];
            }
            
            actual = JSON.stringify(value);
            passed = actual === assertion.value;
          } catch (err) {
            passed = false;
            actual = 'Error evaluating JSON path';
          }
          break;
        case 'header':
          actual = response.headers[assertion.target.toLowerCase()];
          passed = actual === assertion.value;
          break;
        case 'responseTime':
          actual = duration.toString();
          passed = duration <= parseInt(assertion.value);
          break;
      }
      
      return {
        name: `${assertion.type} ${assertion.target} is ${assertion.value}`,
        passed,
        expected: assertion.value,
        actual: actual || 'undefined'
      };
    });
    
    // Determine step status
    const stepPassed = assertions.every(a => a.passed);
    
    return {
      name: step.name,
      status: stepPassed ? 'passed' : 'failed',
      duration,
      request: {
        method: step.method,
        url,
        headers,
        body: step.body
      },
      response: {
        status: response.status,
        headers: response.headers,
        body: typeof response.data === 'object' ? JSON.stringify(response.data) : response.data
      },
      assertions
    };
  } catch (error) {
    logger.error(`Error executing test step ${step.name}:`, error);
    
    return {
      name: step.name,
      status: 'failed',
      duration: 0,
      request: {
        method: step.method,
        url: `${baseUrl}${step.endpoint}`,
        headers: step.headers,
        body: step.body
      },
      response: {
        status: 0,
        headers: {},
        body: error.message
      },
      assertions: step.assertions.map(assertion => ({
        name: `${assertion.type} ${assertion.target} is ${assertion.value}`,
        passed: false,
        expected: assertion.value,
        actual: 'Request failed'
      }))
    };
  }
};
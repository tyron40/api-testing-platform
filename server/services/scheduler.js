import cron from 'node-cron';
import TestSuite from '../models/TestSuite.js';
import Settings from '../models/Settings.js';
import { runTestSuite } from './testRunner.js';
import { logger } from '../utils/logger.js';

export const setupScheduler = () => {
  // Run hourly job
  cron.schedule('0 * * * *', async () => {
    await runScheduledTests('hourly');
  });
  
  // Run daily job
  cron.schedule('0 0 * * *', async () => {
    await runScheduledTests('daily');
    await cleanupOldResults();
  });
  
  // Run weekly job
  cron.schedule('0 0 * * 0', async () => {
    await runScheduledTests('weekly');
  });
  
  // Run monthly job
  cron.schedule('0 0 1 * *', async () => {
    await runScheduledTests('monthly');
  });
  
  logger.info('Test scheduler initialized');
};

const runScheduledTests = async (interval) => {
  try {
    logger.info(`Running scheduled tests for interval: ${interval}`);
    
    // For demo purposes, we'll just log
    // In a real app, you would:
    // 1. Find all users with scheduling enabled for this interval
    // 2. Find all test suites for those users
    // 3. Run each test suite
    
    logger.info(`Completed scheduled tests for interval: ${interval}`);
  } catch (error) {
    logger.error(`Error running scheduled tests for interval ${interval}:`, error);
  }
};

const cleanupOldResults = async () => {
  try {
    logger.info('Cleaning up old test results');
    
    // For demo purposes, we'll just log
    // In a real app, you would:
    // 1. Find all users with retention settings
    // 2. Delete test results older than their retention period
    
    logger.info('Completed cleaning up old test results');
  } catch (error) {
    logger.error('Error cleaning up old test results:', error);
  }
};
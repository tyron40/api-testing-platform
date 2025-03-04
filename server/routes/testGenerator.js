import express from 'express';
import { auth } from '../middleware/auth.js';
import { generateTests } from '../services/testGenerator.js';
import { logger } from '../utils/logger.js';

const router = express.Router();

// @route   POST /api/test-generator/generate
// @desc    Generate test cases from API specification
// @access  Private
router.post('/generate', auth, async (req, res) => {
  try {
    const { baseUrl, apiType } = req.body;
    
    // For demo purposes, we'll return mock data
    // In a real app, you would generate tests based on API specs
    
    // Mock generated test steps
    const steps = await generateTests(baseUrl, apiType);
    
    res.json({ steps });
  } catch (err) {
    logger.error('Generate tests error', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
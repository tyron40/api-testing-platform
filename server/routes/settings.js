import express from 'express';
import { auth } from '../middleware/auth.js';
import Settings from '../models/Settings.js';
import { logger } from '../utils/logger.js';

const router = express.Router();

// @route   GET /api/settings
// @desc    Get user settings
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    // For demo purposes, we'll return mock data
    // In a real app, you would fetch from MongoDB
    
    const settings = {
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
    };
    
    res.json(settings);
  } catch (err) {
    logger.error('Get settings error', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/settings
// @desc    Update user settings
// @access  Private
router.put('/', auth, async (req, res) => {
  try {
    // For demo purposes, we'll just return the request body
    // In a real app, you would update in MongoDB
    
    const settings = {
      ...req.body,
      user: req.user.id,
      updatedAt: new Date().toISOString()
    };
    
    res.json(settings);
  } catch (err) {
    logger.error('Update settings error', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
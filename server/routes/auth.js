import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { auth } from '../middleware/auth.js';
import { logger } from '../utils/logger.js';

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register a user
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // For demo purposes, we'll mock the user creation
    // In a real app, you would create a user in MongoDB
    
    // Mock user data
    const user = {
      id: 'demo-user-id',
      name,
      email
    };
    
    // Generate JWT token
    const token = jwt.sign(
      { user: { id: user.id } },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );
    
    res.json({ token, user });
  } catch (err) {
    logger.error('Registration error', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/auth/login
// @desc    Login a user
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // For demo purposes, we'll mock the user login
    // In a real app, you would verify credentials in MongoDB
    
    // Mock user data
    const user = {
      id: 'demo-user-id',
      name: 'Demo User',
      email
    };
    
    // Generate JWT token
    const token = jwt.sign(
      { user: { id: user.id } },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );
    
    res.json({ token, user });
  } catch (err) {
    logger.error('Login error', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    // For demo purposes, we'll return mock data
    // In a real app, you would fetch from MongoDB
    
    const user = {
      id: req.user.id,
      name: 'Demo User',
      email: 'demo@example.com'
    };
    
    res.json(user);
  } catch (err) {
    logger.error('Get user error', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
import jwt from 'jsonwebtoken';
import { logger } from '../utils/logger.js';

export const auth = (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }
    
    const token = authHeader.split(' ')[1];
    
    // For demo purposes, we'll use a simple verification
    // In a real app, you would verify the token with JWT
    if (token === 'demo-token') {
      req.user = { id: 'demo-user-id' };
      return next();
    }
    
    // Verify token
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      req.user = decoded.user;
      next();
    } catch (err) {
      logger.error('Token verification failed', err);
      res.status(401).json({ message: 'Token is not valid' });
    }
  } catch (err) {
    logger.error('Auth middleware error', err);
    res.status(500).json({ message: 'Server Error' });
  }
};
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import testSuiteRoutes from './routes/testSuites.js';
import testResultRoutes from './routes/testResults.js';
import settingsRoutes from './routes/settings.js';
import testGeneratorRoutes from './routes/testGenerator.js';
import swaggerUi from 'swagger-ui-express';
import { swaggerDocs } from './swagger.js';
import { setupScheduler } from './services/scheduler.js';
import { logger } from './utils/logger.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/test-suites', testSuiteRoutes);
app.use('/api/test-results', testResultRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/test-generator', testGeneratorRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Connect to MongoDB
const startServer = async () => {
  try {
    // For demo purposes, we'll mock the MongoDB connection
    // In a real app, you would connect to MongoDB here
    // await mongoose.connect(process.env.MONGODB_URI);
    
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
      
      // Initialize the test scheduler
      setupScheduler();
    });
  } catch (error) {
    logger.error('Failed to connect to MongoDB', error);
    process.exit(1);
  }
};

startServer();
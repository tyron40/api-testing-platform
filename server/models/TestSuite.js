import mongoose from 'mongoose';

const testSuiteSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  baseUrl: {
    type: String,
    required: true,
    trim: true
  },
  apiType: {
    type: String,
    enum: ['REST', 'GraphQL'],
    default: 'REST'
  },
  environment: {
    type: String,
    enum: ['development', 'staging', 'production'],
    default: 'development'
  },
  steps: [{
    name: {
      type: String,
      required: true
    },
    method: {
      type: String,
      enum: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
      default: 'GET'
    },
    endpoint: {
      type: String,
      required: true
    },
    headers: [{
      key: String,
      value: String
    }],
    body: String,
    assertions: [{
      type: {
        type: String,
        enum: ['status', 'json', 'header', 'responseTime'],
        default: 'status'
      },
      target: String,
      value: String
    }]
  }],
  lastRun: {
    type: Date
  },
  status: {
    type: String,
    enum: ['passed', 'failed', 'pending'],
    default: 'pending'
  },
  passRate: {
    type: Number,
    default: 0
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field on save
testSuiteSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const TestSuite = mongoose.model('TestSuite', testSuiteSchema);

export default TestSuite;
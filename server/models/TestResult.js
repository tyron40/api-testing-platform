import mongoose from 'mongoose';

const testResultSchema = new mongoose.Schema({
  testSuiteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TestSuite',
    required: true
  },
  testSuiteName: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['passed', 'failed', 'pending'],
    default: 'pending'
  },
  startTime: {
    type: Date,
    default: Date.now
  },
  endTime: {
    type: Date
  },
  duration: {
    type: Number,
    default: 0
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
    status: {
      type: String,
      enum: ['passed', 'failed'],
      required: true
    },
    duration: {
      type: Number,
      default: 0
    },
    request: {
      method: String,
      url: String,
      headers: Object,
      body: String
    },
    response: {
      status: Number,
      headers: Object,
      body: String
    },
    assertions: [{
      name: String,
      passed: Boolean,
      expected: String,
      actual: String
    }]
  }],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

const TestResult = mongoose.model('TestResult', testResultSchema);

export default TestResult;
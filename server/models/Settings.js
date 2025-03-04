import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  notifications: {
    emailNotifications: {
      type: Boolean,
      default: true
    },
    failureAlerts: {
      type: Boolean,
      default: true
    },
    dailyDigest: {
      type: Boolean,
      default: false
    }
  },
  scheduling: {
    enableScheduling: {
      type: Boolean,
      default: false
    },
    interval: {
      type: String,
      enum: ['hourly', 'daily', 'weekly', 'monthly'],
      default: 'daily'
    },
    retainResults: {
      type: Number,
      default: 30,
      min: 1,
      max: 365
    }
  },
  security: {
    apiKeyAuth: {
      type: Boolean,
      default: true
    },
    basicAuth: {
      type: Boolean,
      default: false
    },
    oauthEnabled: {
      type: Boolean,
      default: false
    },
    oauthClientId: {
      type: String,
      default: ''
    },
    oauthClientSecret: {
      type: String,
      default: ''
    }
  },
  environment: {
    variables: [{
      key: String,
      value: String
    }]
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field on save
settingsSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Settings = mongoose.model('Settings', settingsSchema);

export default Settings;
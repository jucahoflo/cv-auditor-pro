const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  subscription: {
    plan: {
      type: String,
      enum: ['free', 'basic', 'pro', 'enterprise'],
      default: 'free'
    },
    creditsUsed: {
      type: Number,
      default: 0
    },
    creditsLimit: {
      type: Number,
      default: 5
    },
    stripeCustomerId: String,
    stripeSubscriptionId: String,
    subscriptionEndDate: Date
  },
  auditHistory: [{
    fileName: String,
    jobDescription: String,
    score: Number,
    result: Object,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);
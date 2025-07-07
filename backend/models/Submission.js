const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  user: {
    type: String, // username (unique, required)
    required: true
  },
  problem: {
    type: String, // problem code (unique, required)
    required: true
  },
  code: {
    type: String,
    required: true
  },
  language: {
    type: String,
    required: true,
    enum: ['python', 'javascript', 'java', 'cpp', 'c']
  },
  status: {
    type: String,
    required: true,
    enum: ['accepted', 'wrong_answer', 'time_limit_exceeded', 'runtime_error', 'compilation_error'],
    default: 'wrong_answer'
  },
  executionTime: {
    type: Number, // in milliseconds
    default: 0
  },
  memoryUsed: {
    type: Number, // in MB
    default: 0
  },
  testCasesPassed: {
    type: Number,
    default: 0
  },
  totalTestCases: {
    type: Number,
    default: 0
  },
  errorMessage: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Index for efficient queries
submissionSchema.index({ user: 1, createdAt: -1 });
submissionSchema.index({ problem: 1, user: 1 });

module.exports = mongoose.model('Submission', submissionSchema); 
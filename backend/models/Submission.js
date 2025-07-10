const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  problem: { type: mongoose.Schema.Types.ObjectId, ref: 'Problem', required: true },
  code: {
    type: String,
    required: true
  },
  language: {
    type: String,
    required: true,
    enum: ['python', 'javascript', 'java', 'cpp', 'c']
  },
  result: {
    type: String,
    required: true
  },

}, {
  timestamps: true
});

// Index for efficient queries
submissionSchema.index({ user: 1, createdAt: -1 });
submissionSchema.index({ problem: 1, user: 1 });

module.exports = mongoose.model('Submission', submissionSchema); 
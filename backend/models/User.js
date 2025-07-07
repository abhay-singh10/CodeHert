const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
    trim: true,
  },
  last_name: {
    type: String,
    trim: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user', // everyone is a user by default
  },
  // Stats fields
  problemsSolved: {
    type: [String], // array of problem codes
    default: []
  },
  problemsAttempted: {
    type: [String], // array of problem codes
    default: []
  },
  totalSubmissions: {
    type: Number,
    default: 0
  },
  points: {
    type: Number,
    default: 0
  },
  rank: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true // adds createdAt and updatedAt fields
});

module.exports = mongoose.model('User', userSchema);

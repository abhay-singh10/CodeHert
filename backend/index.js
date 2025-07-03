const express = require('express');
require('dotenv').config();
const connectDB = require('./database/db');

// Import routes
const authRoutes = require('./routes/auth');
const problemRoutes = require('./routes/problem');

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.send('Backend is working!');
});
//authentication routes
app.use('/api/auth', authRoutes);

//problem management routes
app.use('/api/problems', problemRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
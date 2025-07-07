const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./database/db');
const cookieParser = require('cookie-parser');

// Import routes
const authRoutes = require('./routes/auth');
const problemRoutes = require('./routes/problem');
const userRoutes = require('./routes/user');

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

// CORS middleware
app.use(cors({
  origin: 'http://localhost:5174', // Frontend URL
  credentials: true
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
//authentication routes
app.use('/api/auth', authRoutes);

//problem management routes
app.use('/api/problems', problemRoutes);

//user management routes
app.use('/api/user', userRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
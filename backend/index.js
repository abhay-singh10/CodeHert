const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./database/db');
const cookieParser = require('cookie-parser');

// Import routes
const authRoutes = require('./routes/auth');
const problemRoutes = require('./routes/problem');
const userRoutes = require('./routes/user');
const adminProblemRoutes = require('./routes/admin/adminProblem');
const adminTestCaseRoutes = require('./routes/admin/adminTestCase');
const compileRoutes = require('./routes/compile');

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

// CORS middleware
app.use(cors({
  origin: 'http://localhost:5173', // Frontend URL
  credentials: true
}));


// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
const authMiddleware = require('./middleware/authMiddleware');
const isAdmin = require('./middleware/isAdmin');

// Routes
//authentication routes
app.use('/api/auth', authRoutes);

//problem
app.use('/api/problems', problemRoutes);

//admin functions
//problems
app.use('/api/admin/problems', authMiddleware, isAdmin, adminProblemRoutes);

//Test cases
app.use('/api/admin/testcases', authMiddleware, isAdmin, adminTestCaseRoutes);

//user management routes
app.use('/api/user', userRoutes);

//compiler
app.use('/api/compile', authMiddleware, compileRoutes);


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
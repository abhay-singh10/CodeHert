const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./database/db');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');

// Import routes
const authRoutes = require('./routes/auth');
const problemRoutes = require('./routes/problem');
const userRoutes = require('./routes/user');
const submissionRoutes = require('./routes/submission');
const adminProblemRoutes = require('./routes/admin/adminProblem');
const adminTestCaseRoutes = require('./routes/admin/adminTestCase');
const compileRoutes = require('./routes/compile');
const aiRoutes = require('./routes/ai');
const corsMiddleware = require('./middleware/corsConfig');

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

// This is required for correct client IP detection and rate limiting
app.set('trust proxy', 1);


// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(corsMiddleware);
const authMiddleware = require('./middleware/authMiddleware');
const isAdmin = require('./middleware/isAdmin');
const { compilerLimiter } = require('./middleware/rateLimit');
const { aiLimiter } = require('./middleware/rateLimit');

// Routes
//authentication routes
app.use('/api/auth', authRoutes);

//problem
app.use('/api/problems', problemRoutes);

//submissions
app.use('/api/submissions', submissionRoutes);

//admin functions
//problems
app.use('/api/admin/problems', authMiddleware, isAdmin, adminProblemRoutes);

//Test cases
app.use('/api/admin/testcases', authMiddleware, isAdmin, adminTestCaseRoutes);

//user management routes
app.use('/api/user', userRoutes);

//compiler
app.use('/api/compile', authMiddleware, compilerLimiter, compileRoutes);

//Hugging face Ai
app.use('/api/ai', aiLimiter, aiRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
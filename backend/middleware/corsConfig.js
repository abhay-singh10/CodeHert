// filepath: backend/middleware/corsConfig.js
const cors = require('cors');

const allowedOrigins = [
  'http://localhost:5173',
  'https://www.codehert.dev',
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
};

module.exports = cors(corsOptions);
const rateLimit = require('express-rate-limit');

// Example: limit each IP to 10 submissions per minute
const compilerLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // limit each IP to 10 requests per windowMs
  handler: (req, res) => {
    res.status(429).json({ message: 'Too many requests, please try again after 1 minute.' });
  }
});

const aiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute 
    max: 3, // limit each IP to 3 requests per windowMs
    handler: (req, res) => {
    res.status(429).json({ message: 'Too many requests, please try again after 1 minute.' });
    }
});
module.exports = { compilerLimiter,  aiLimiter};

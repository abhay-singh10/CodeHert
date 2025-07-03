const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    /*await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });*/
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MONGODB_URI from .env:", process.env.MONGODB_URI);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    
    process.exit(1);
  }
};

module.exports = connectDB ;

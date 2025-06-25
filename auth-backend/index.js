const express = require('express');
require('dotenv').config();
const connectDB = require('./database/db');

connectDB();  

const app = express();
app.use(express.json());    
app.use(express.urlencoded({ extended: true }));


const authRoutes = require('./routes/auth');

app.use('/api/auth', authRoutes); 


app.get("/", (req, res) => {
  res.send("Backend is working!");
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
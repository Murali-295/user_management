const express = require('express');
// const bodyParser = require('body-parser');
require('dotenv').config();
const userRoutes = require('./routes/userRoutes');
const app = express();
const bodyParser = require('body-parser')

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Routes
app.use('/user', userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

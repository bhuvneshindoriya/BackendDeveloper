const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables
const app = express();
const port = process.env.PORT || 3001;

// Import routes
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');

// Connect to MongoDB
mongoose.connect(process.env.DB_CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Failed to connect to MongoDB', error);
  });

// Middleware
app.use(express.json());

// Routes
app.use('/api/items', productRoutes);
app.use('/',userRoutes)

// Custom error handling middleware
app.use((err, req, res, next) => {
  if (err.name === 'ValidationError') {
    // Handle Mongoose validation errors
    const errors = [];
    for (let field in err.errors) {
      if (err.errors.hasOwnProperty(field)) {
        errors.push({
          field,
          message: err.errors[field].message,
        });
      }
    }

    return res.status(400).json({ errors });
  }

  if (err.name === 'CastError') {
    // Handle MongoDB document casting errors
    return res.status(400).json({ error: 'Invalid resource ID' });
  }

  // Custom error handling logic based on error types
  if (err.customFieldError) {
    // Handle custom validation errors
    return res.status(400).json({ error: err.customFieldError });
  }

  if (err.code === 11000) {
    // Handle duplicate key errors
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({ error: `${field} already exists` });
  }

  // Handle other errors
  //console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const mongoose = require('mongoose');

// Define the product schema
const productSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 100
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    description: {
      type: String,
      required: true,
      minlength: 10,
      maxlength: 500
    },
    category: {
      type: String,
      required: true,
      enum: ['Electronics', 'Clothing', 'Home', 'Beauty', 'Other']
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
    createdAt: {
        type: Date,
        default: Date.now,
      }
    // Other fields...
  });

// Create the product model
const Product = mongoose.model('Product', productSchema);

// Export the product model
module.exports = Product;





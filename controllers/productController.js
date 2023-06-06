const { body, validationResult } = require('express-validator');
const Product = require('../models/Product');

// Get all products with pagination and sorting
const getAllProducts = async (req, res) => {
  try {
    // Pagination and sorting code here...
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder || 'desc';

    const totalProducts = await Product.countDocuments();

    const totalPages = Math.ceil(totalProducts / limit);
    const offset = (page - 1) * limit;

    const products = await Product.find()
      .sort({ [sortBy]: sortOrder })
      .skip(offset)
      .limit(limit);

   return res.json({ products, totalPages });
  } catch (error) {
   return res.status(500).json({ error: error.message });
  }
};

// Get a single product by ID
const getProductById = async (req, res) => {
  try {
    // getProductById code here...
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
   return res.status(500).json({ error: error.message });
  }
};

// Create a new product
const createProduct = async (req, res) => {
    try {
      // Custom validation messages
      const validationMessages = {
        required: 'This field is required.',
        string: 'Invalid input. Expected a string.',
        integer: 'Invalid input. Expected an integer.',
        min: (field, min) => `The ${field} must be at least ${min}.`,
        max: (field, max) => `The ${field} must be at most ${max}.`,
        isIn: (field, values) => `The ${field} must be one of ${values.join(', ')}.`,
      };
  
      // Custom error handler
      const handleValidationErrors = (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          const formattedErrors = errors.array().map(err => {
            let message = err.msg;
            if (err.msg === 'Name is required.') {
              message = 'Name field is required.';
            } else if (typeof validationMessages[err.validatorKey] === 'function') {
              message = validationMessages[err.validatorKey](err.param, err.value);
            } else if (validationMessages[err.msg]) {
              message = validationMessages[err.msg];
            }
            return { field: err.param, message };
          });
          return res.status(400).json({ errors: formattedErrors });
        }
        next();
      };
  
      // Validation rules for createProduct
      const createProductValidationRules = [
        body('name')
          .trim()
          .isLength({ min: 2, max: 100 })
          .withMessage(validationMessages.min('Name', 2))
          .withMessage(validationMessages.max('Name', 100))
          .notEmpty()
          .withMessage('Name is required.'),
  
        body('price')
          .isInt({ min: 0 })
          .withMessage(validationMessages.integer)
          .notEmpty()
          .withMessage(validationMessages.required),
  
        body('description')
          .trim()
          .isLength({ min: 10, max: 500 })
          .withMessage(validationMessages.min('Description', 10))
          .withMessage(validationMessages.max('Description', 500))
          .notEmpty()
          .withMessage(validationMessages.required),
  
        body('category')
          .isIn(['Electronics', 'Clothing', 'Home', 'Beauty', 'Other'])
          .withMessage(validationMessages.isIn('Category', ['Electronics', 'Clothing', 'Home', 'Beauty', 'Other']))
          .notEmpty()
          .withMessage(validationMessages.required),
      ];
  
      // Check for validation errors
      createProductValidationRules.forEach(validationRule => validationRule.run(req));
      handleValidationErrors(req, res, async () => {
        const { name, price, description, category } = req.body;
       let user = req.decode.userId;

        // Create a new product
        const product = new Product({ name, price, description, category,user });
  
        try {
          // Save the product to the database
          await product.save();
         return res.status(201).json(product);
        } catch (error) {
          // Handle validation error from Mongoose
          if (error.name === 'ValidationError') {
            const formattedErrors = Object.keys(error.errors).map(field => ({
              field,
              message: error.errors[field].message,
            }));
            return res.status(400).json({ errors: formattedErrors });
          }
          throw error; // Let the error middleware handle other types of errors
        }
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  };
  

// Update a product by ID
const updateProductById = async (req, res) => {
    try {
      let checkIdExist = await Product.findById(req.params.id);

      if (!checkIdExist) {
        return res.status(404).json({ error: "Product not found" });
      }
      if(checkIdExist.user.toString()!==req.decode.userId){
        return res.status(403).json({ status: false, message: 'You are not authorized to perform this action' });
      }
      // Custom validation messages
      const validationMessages = {
        required: 'This field is required.',
        string: 'Invalid input. Expected a string.',
        integer: 'Invalid input. Expected an integer.',
        min: (field, min) => `The ${field} must be at least ${min}.`,
        max: (field, max) => `The ${field} must be at most ${max}.`,
        isIn: (field, values) => `The ${field} must be one of ${values.join(', ')}.`,
      };
  
      // Custom error handler
      const handleValidationErrors = (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          const formattedErrors = errors.array().map(err => {
            let message = err.msg;
            if (typeof validationMessages[err.validatorKey] === 'function') {
              message = validationMessages[err.validatorKey](err.param, err.value);
            } else if (validationMessages[err.msg]) {
              message = validationMessages[err.msg];
            }
            return { field: err.param, message };
          });
          return res.status(400).json({ errors: formattedErrors });
        }
        next();
      };
  
      // Validation rules for updateProduct
      const updateProductValidationRules = [
        body('name')
          .trim()
          .isLength({ min: 2, max: 100 })
          .withMessage(validationMessages.min('Name', 2))
          .withMessage(validationMessages.max('Name', 100))
          .notEmpty()
          .withMessage(validationMessages.required)
          .bail(),
  
        body('price')
          .isInt({ min: 0 })
          .withMessage(validationMessages.integer)
          .notEmpty()
          .withMessage(validationMessages.required)
          .bail(),
  
        body('description')
          .trim()
          .isLength({ min: 10, max: 500 })
          .withMessage(validationMessages.min('Description', 10))
          .withMessage(validationMessages.max('Description', 500))
          .notEmpty()
          .withMessage(validationMessages.required)
          .bail(),
  
        body('category')
          .isIn(['Electronics', 'Clothing', 'Home', 'Beauty', 'Other'])
          .withMessage(validationMessages.isIn('Category', ['Electronics', 'Clothing', 'Home', 'Beauty', 'Other']))
          .notEmpty()
          .withMessage(validationMessages.required)
          .bail()
      ];
  
      // Check for validation errors
      await Promise.all(updateProductValidationRules.map(validationRule => validationRule.run(req)));
      handleValidationErrors(req, res, async () => {
        const { name, price, description, category } = req.body;
  
        // Find the product by ID and update it
        const product = await Product.findByIdAndUpdate(
          req.params.id,
          { name, price, description, category },
          { new: true }
        );
  
        res.json(product);
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  

// Delete a product by ID
const deleteProductById = async (req, res) => {
  try {
    // Delete the product by ID
    const product = await Product.findByIdAndRemove(req.params.id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    if(product.user.toString()!==req.decode.userId){
      return res.status(403).json({ status: false, message: 'You are not authorized to perform this action' });
    }
    console.log(product.user.toString());
    console.log(req.decode.userId);
   return res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProductById,
  deleteProductById
};

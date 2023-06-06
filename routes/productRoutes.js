const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const {authenticate} = require('../middleware/auth')

// Route to create a new product
router.post('/',authenticate, productController.createProduct);

// Route to get all products
router.get('/',authenticate,productController.getAllProducts);

// Route to get a specific product by ID
router.get('/:id',authenticate,productController.getProductById);

// Route to update a specific product by ID
router.put('/:id',authenticate, productController.updateProductById);

// Route to delete a specific product by ID
router.delete('/:id',authenticate,productController.deleteProductById);

module.exports = router; 
 
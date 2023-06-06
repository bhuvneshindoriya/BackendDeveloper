const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');

exports.registerUser = async (req, res) => {
    try {
      // Custom validation messages
      const validationMessages = {
        required: 'This field is required.',
        email: 'Invalid email address.',
        password: 'Password must be at least 6 characters.',
      };
  
      // Validation rules for registerUser
      const registerUserValidationRules = [
        body('username')
          .trim()
          .isLength({ min: 3, max: 20 })
          .withMessage('Username must be between 3 and 20 characters.')
          .notEmpty()
          .withMessage(validationMessages.required),
  
        body('email')
          .trim()
          .isEmail()
          .withMessage(validationMessages.email)
          .notEmpty()
          .withMessage(validationMessages.required)
          .normalizeEmail(),
  
        body('password')
          .isLength({ min: 6 })
          .withMessage(validationMessages.password)
          .notEmpty()
          .withMessage(validationMessages.required),
      ];
  
      // Check for validation errors
      await Promise.all(registerUserValidationRules.map(validationRule => validationRule.run(req)));
  
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const formattedErrors = errors.array().map(err => ({
          field: err.param,
          message: err.msg,
        }));
        return res.status(400).json({ errors: formattedErrors });
      }
  
      const { username, email, password } = req.body;
  
      // Check if the username or email is already registered
      const existingUser = await User.findOne().or([{ username }, { email }]);
      if (existingUser) {
        const errorField = existingUser.username === username ? 'username' : 'email';
        return res.status(400).json({ errors: [{ field: errorField, message: 'Username or email already exists.' }] });
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create a new user
      const user = new User({ username, email, password: hashedPassword });
  
      // Save the user to the database
      await user.save();
  
      // Generate a JWT token
      const token = jwt.sign({ userId: user._id }, 'secretKey', { expiresIn: '1h' });
  
      res.status(201).json({ message: 'User registered successfully.', token });
    } catch (error) {
      res.status(500).json({ error: 'Something went wrong.' });
    }
  };
  
  
  exports.loginUser = async (req, res) => {
    try {
      // Custom validation messages
      const validationMessages = {
        required: 'This field is required.',
      };
  
      // Validation rules for loginUser
      const loginUserValidationRules = [
        body('username')
          .trim()
          .notEmpty()
          .withMessage(validationMessages.required),
  
        body('password')
          .notEmpty()
          .withMessage(validationMessages.required),
      ];
  
      // Check for validation errors
      await Promise.all(loginUserValidationRules.map(validationRule => validationRule.run(req)));
  
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const formattedErrors = errors.array().map(err => ({
          field: err.param,
          message: err.msg,
        }));
        return res.status(400).json({ errors: formattedErrors });
      }
  
      const { username, password } = req.body;
  
      // Check if the user exists
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }
  
      // Compare the provided password with the hashed password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid password.' });
      }
  
      // Generate a JWT token
      const token = jwt.sign({ userId: user._id }, 'secretKey', { expiresIn: '1h' });
  
      // Authentication successful
      res.json({ message: 'Login successful.', token });
    } catch (error) {
      res.status(500).json({ error: 'Something went wrong.' });
    }
  };
  

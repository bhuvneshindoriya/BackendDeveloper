const jwt = require('jsonwebtoken');


// Authentication middleware   
exports.authenticate = (req, res, next) => {
  try {
    const token = req.headers['authorization']?.replace('Bearer ', '');
    console.log(token);
    if (!token) {
      return res.status(400).json({ status: false, message: 'Authentication token is required' });
    }

    jwt.verify(token, 'secretKey', (err, decode) => {
      if (err) {
        return res.status(401).json({ status: false, message: 'Invalid authentication token' });
      }
      console.log(decode);
      req.decode = decode;
      next();
    });
  } catch (error) {
    res.status(500).json({ status: false, message: 'Internal server error' });
  }
};



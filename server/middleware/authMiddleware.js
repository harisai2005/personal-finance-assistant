const jwt = require('jsonwebtoken');
const User = require('../models/user');

/**
 * Middleware to protect routes using JWT authorization.
 */
const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check for token in header
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorized, token missing' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verify token and fetch user
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'test_secret_123');
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({ message: 'Not authorized, user not found' });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error('❌ Token verification failed:', err.message);
    res.status(401).json({ message: 'Not authorized, token invalid' });
  }
};

module.exports = protect;

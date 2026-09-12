const jwt = require('jsonwebtoken');
const User = require('../models/User');

// This middleware protects routes that require login
// It checks the JWT token in the Authorization header
async function protect(req, res, next) {
  let token;

  // Check if Authorization header exists and starts with "Bearer"
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract the token (remove "Bearer " prefix)
      token = req.headers.authorization.split(' ')[1];

      // Verify the token using our secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find the user in DB and attach to request (exclude password)
      req.user = await User.findById(decoded.id).select('-password');

      next(); // Continue to the route handler
    } catch (error) {
      return res.status(401).json({ message: 'Invalid or expired token. Please login again.' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'No token. Please login to access this resource.' });
  }
}

// This middleware checks if the logged-in user is an admin
function adminOnly(req, res, next) {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ message: 'Access denied. Admins only.' });
  }
}

module.exports = { protect, adminOnly };

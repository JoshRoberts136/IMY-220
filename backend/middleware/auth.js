const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

// Middleware to protect routes
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        error: 'Access denied',
        message: 'No token provided'
      });
    }

    const token = authHeader.split(' ')[1]; // Bearer <token>
    
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Access denied',
        message: 'Invalid token format'
      });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // Get user from database
    let user;
    if (mongoose.Types.ObjectId.isValid(decoded.userId)) {
      user = await mongoose.connection.db.collection('Users').findOne({
        _id: new mongoose.Types.ObjectId(decoded.userId)
      });
    } else {
      user = await mongoose.connection.db.collection('Users').findOne({
        id: decoded.userId
      });
    }
    
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        error: 'Access denied',
        message: 'User not found or inactive'
      });
    }

    // Add user to request object (remove password)
    const { password, ...userWithoutPassword } = user;
    req.user = userWithoutPassword;
    next();
    
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        error: 'Access denied',
        message: 'Invalid token'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Access denied',
        message: 'Token expired'
      });
    }

    console.error('Auth middleware error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
      message: 'Authentication failed'
    });
  }
};

// Optional authentication - doesn't fail if no token
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return next();
    }

    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    let user;
    if (mongoose.Types.ObjectId.isValid(decoded.userId)) {
      user = await mongoose.connection.db.collection('Users').findOne({
        _id: new mongoose.Types.ObjectId(decoded.userId)
      });
    } else {
      user = await mongoose.connection.db.collection('Users').findOne({
        id: decoded.userId
      });
    }
    
    if (user && user.isActive) {
      const { password, ...userWithoutPassword } = user;
      req.user = userWithoutPassword;
    }
    
    next();
    
  } catch (error) {
    // Don't fail on optional auth, just continue without user
    next();
  }
};

module.exports = {
  authenticateToken,
  optionalAuth
};

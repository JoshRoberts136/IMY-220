const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      console.log('AUTH ERROR: No auth header');
      return res.status(401).json({
        success: false,
        error: 'Access denied',
        message: 'No token provided'
      });
    }

    const token = authHeader.split(' ')[1];
    
    if (!token) {
      console.log('AUTH ERROR: No token in header');
      return res.status(401).json({
        success: false,
        error: 'Access denied',
        message: 'Invalid token format'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    console.log('Decoded token userId:', decoded.userId);
    
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
    
    console.log('Found user:', user ? user.id : 'NOT FOUND');
    
    if (!user || !user.isActive) {
      console.log('AUTH ERROR: User not found or inactive');
      return res.status(401).json({
        success: false,
        error: 'Access denied',
        message: 'User not found or inactive'
      });
    }

    const { password, ...userWithoutPassword } = user;
    req.user = userWithoutPassword;
    console.log('Auth successful, req.user.id:', req.user.id);
    next();
    
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      console.log('AUTH ERROR: Invalid token');
      return res.status(401).json({
        success: false,
        error: 'Access denied',
        message: 'Invalid token'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      console.log('AUTH ERROR: Token expired');
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
    next();
  }
};

module.exports = {
  authenticateToken,
  optionalAuth
};

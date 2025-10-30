const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');
const { getDB } = require('../config/database');

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

    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Access denied',
        message: 'Invalid token format'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const db = getDB();

    let user;
    if (ObjectId.isValid(decoded.userId) && decoded.userId.length === 24) {
      user = await db.collection('Users').findOne({
        _id: new ObjectId(decoded.userId)
      });
    } else {
      user = await db.collection('Users').findOne({
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
    const db = getDB();

    let user;
    if (ObjectId.isValid(decoded.userId) && decoded.userId.length === 24) {
      user = await db.collection('Users').findOne({
        _id: new ObjectId(decoded.userId)
      });
    } else {
      user = await db.collection('Users').findOne({
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

const requireAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        error: 'Access denied',
        message: 'No token provided'
      });
    }

    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Access denied',
        message: 'Invalid token format'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const db = getDB();

    let user;
    if (ObjectId.isValid(decoded.userId) && decoded.userId.length === 24) {
      user = await db.collection('Users').findOne({
        _id: new ObjectId(decoded.userId)
      });
    } else {
      user = await db.collection('Users').findOne({
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

    if (!user.isAdmin) {
      return res.status(403).json({
        success: false,
        error: 'Access denied',
        message: 'Admin privileges required'
      });
    }

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

    res.status(500).json({
      success: false,
      error: 'Server error',
      message: 'Authentication failed'
    });
  }
};

module.exports = {
  authenticateToken,
  optionalAuth,
  requireAdmin
};

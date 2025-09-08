const express = require('express');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: '7d' } // Token expires in 7 days
  );
};

// Register new user
router.post('/signup', async (req, res) => {
  try {
    const { legendName, legendId, passcode, profile } = req.body;

    // Validate required fields
    if (!legendName || !legendId || !passcode) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        message: 'Please provide legendName, legendId (email), and passcode'
      });
    }

    // Check if user already exists
    const existingUser = await User.findByEmailOrUsername(legendId);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: 'User already exists',
        message: 'A champion with this Legend ID already exists'
      });
    }

    // Create new user
    const newUser = new User({
      username: legendName,
      email: legendId,
      password: passcode,
      profile: profile || {
        firstName: '',
        lastName: '',
        bio: 'A new champion has joined the realm!'
      },
      lastLogin: new Date()
    });

    await newUser.save();

    // Generate token
    const token = generateToken(newUser._id);

    // Return user data (password excluded by schema transform)
    res.status(201).json({
      success: true,
      message: 'Champion registration successful!',
      user: {
        id: newUser._id,
        legendName: newUser.username,
        legendId: newUser.email,
        profile: newUser.profile,
        createdAt: newUser.createdAt
      },
      token: token
    });

  } catch (error) {
    console.error('Signup error:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to register champion'
    });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { legendId, passcode } = req.body;

    // Validate required fields
    if (!legendId || !passcode) {
      return res.status(400).json({
        success: false,
        error: 'Missing credentials',
        message: 'Please provide both Legend ID and passcode'
      });
    }

    // Find user by email or username
    const user = await User.findByEmailOrUsername(legendId);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials',
        message: 'Legend ID not found'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        error: 'Account inactive',
        message: 'Your account has been deactivated'
      });
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(passcode);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials',
        message: 'Incorrect passcode'
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Welcome back, Champion!',
      user: {
        id: user._id,
        legendName: user.username,
        legendId: user.email,
        profile: user.profile,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt
      },
      token: token
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to authenticate'
    });
  }
});

// Logout (client-side token removal)
router.post('/logout', authenticateToken, async (req, res) => {
  try {
    // In a more advanced setup, you might want to blacklist the token
    // For now, logout is handled client-side by removing the token
    
    res.status(200).json({
      success: true,
      message: 'Logout successful. May the odds be ever in your favor!'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to logout'
    });
  }
});

// Verify token and get current user
router.get('/verify', authenticateToken, async (req, res) => {
  try {
    // req.user is set by the authenticateToken middleware
    res.status(200).json({
      success: true,
      message: 'Token verified',
      user: {
        id: req.user._id,
        legendName: req.user.username,
        legendId: req.user.email,
        profile: req.user.profile,
        lastLogin: req.user.lastLogin,
        createdAt: req.user.createdAt
      }
    });
  } catch (error) {
    console.error('Verify token error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to verify token'
    });
  }
});

// Get current user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      data: {
        id: req.user._id,
        legendName: req.user.username,
        legendId: req.user.email,
        profile: req.user.profile,
        lastLogin: req.user.lastLogin,
        createdAt: req.user.createdAt,
        updatedAt: req.user.updatedAt
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to get profile'
    });
  }
});

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { profile } = req.body;
    
    // Update profile fields
    if (profile) {
      req.user.profile = {
        ...req.user.profile,
        ...profile
      };
    }
    
    await req.user.save();
    
    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        id: req.user._id,
        legendName: req.user.username,
        legendId: req.user.email,
        profile: req.user.profile,
        updatedAt: req.user.updatedAt
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        message: error.message
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to update profile'
    });
  }
});

module.exports = router;

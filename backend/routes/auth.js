const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');
const User = require('../models/userModel');
const router = express.Router();

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: '24h'
  });
};

router.post('/login', async (req, res) => {
  try {
    console.log('=== LOGIN REQUEST RECEIVED ===');
    console.log('Request body:', req.body);
    const { email, password } = req.body;
    console.log('Email:', email);

    // Find user by email using the string id field
    const user = await User.db.collection('Users').findOne({ email: email });
    console.log('User found:', user ? user.username : 'null');

    if (!user) {
      console.log('No user found with email:', email);
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    console.log('Stored password hash:', user.password);

    const isValidPassword = await bcrypt.compare(password, user.password);
    console.log('Bcrypt comparison result:', isValidPassword);

    if (!isValidPassword) {
      console.log('Password validation failed');
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    console.log('Password validation successful');

    // Generate JWT token using the string id
    const token = generateToken(user.id);
    console.log('Generated token:', token ? 'SUCCESS' : 'FAILED');

    // Update last login
    await User.db.collection('Users').updateOne(
      { id: user.id },
      { $set: { lastLogin: new Date() } }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        _id: user._id,
        username: user.username,
        email: user.email,
        profile: user.profile
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Simple register route
router.post('/register', async (req, res) => {
  try {
    console.log('=== REGISTER REQUEST RECEIVED ===');
    console.log('Request body:', req.body);
    const { username, email, password, profile } = req.body;

    // Check if user already exists in Users collection
    const existingUser = await User.db.collection('Users').findOne({
      $or: [{ email }, { username }]
    });
    
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user in Users collection with string id
    const newUser = {
      id: `user_${Date.now()}`,
      username,
      email,
      password: hashedPassword,
      profile: profile || {},
      isActive: true,
      ownedProjects: [],
      memberProjects: [],
      commits: [],
      friends: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    };

    const result = await User.db.collection('Users').insertOne(newUser);
    console.log('User created:', result.insertedId);

    // Generate JWT token using the string id
    const token = generateToken(newUser.id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: newUser.id,
        _id: result.insertedId,
        username: newUser.username,
        email: newUser.email,
        profile: newUser.profile
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Verify token
router.get('/verify', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // Find user by string id
    const user = await User.db.collection('Users').findOne({ id: decoded.userId });
    
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        _id: user._id,
        username: user.username,
        email: user.email,
        profile: user.profile
      }
    });
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
});

// Update current user profile
router.put('/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const { profile } = req.body;
    
    console.log('Updating profile for user:', decoded.userId);
    console.log('Profile data:', profile);
    
    const updateData = {
      $set: {
        'profile.title': profile?.title || '',
        'profile.bio': profile?.bio || '',
        'profile.location': profile?.location || '',
        updatedAt: new Date().toISOString()
      }
    };

    // Use string id
    const result = await User.db.collection('Users').findOneAndUpdate(
      { id: decoded.userId },
      updateData,
      { returnDocument: 'after' }
    );

    console.log('Update result:', result);
    
    res.json({ success: true, message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
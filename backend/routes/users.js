const express = require('express');
const mongoose = require('mongoose');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// Get all users (for search)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const users = await mongoose.connection.db.collection('Users')
      .find({})
      .project({
        id: 1,
        username: 1,
        email: 1,
        profile: 1,
        isActive: 1
      })
      .toArray();
    
    res.json({
      success: true,
      users: users
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users'
    });
  }
});

// Get user by ID
router.get('/:userId', authenticateToken, async (req, res) => {
  try {
    const userId = req.params.userId;
    
    const user = await mongoose.connection.db.collection('Users').findOne({ id: userId });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.json({
      success: true,
      id: user.id,
      username: user.username,
      email: user.email,
      profile: user.profile,
      isActive: user.isActive,
      friends: user.friends || [],
      ownedProjects: user.ownedProjects || [],
      memberProjects: user.memberProjects || []
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user'
    });
  }
});

// Get user's profile
router.get('/:userId/profile', authenticateToken, async (req, res) => {
  try {
    const userId = req.params.userId;
    
    const user = await mongoose.connection.db.collection('Users').findOne({ id: userId });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        profile: user.profile,
        isActive: user.isActive
      }
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user profile'
    });
  }
});

module.exports = router;

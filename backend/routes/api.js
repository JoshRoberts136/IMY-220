const express = require('express');
const mongoose = require('mongoose');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// Example API route
router.get('/test', (req, res) => {
  res.json({ message: 'API test successful!' });
});

// Get all users (for project members, etc.)
router.get('/users', authenticateToken, async (req, res) => {
  try {
    const users = await mongoose.connection.db.collection('Users').find({}).limit(10).toArray();
    
    // Remove passwords from response
    const usersWithoutPasswords = users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
    
    res.json(usersWithoutPasswords);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users'
    });
  }
});

// Get user profile by ID
router.get('/users/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Try to find by custom id first, then by _id
    let user = await mongoose.connection.db.collection('Users').findOne({ id: userId });
    
    if (!user && mongoose.Types.ObjectId.isValid(userId)) {
      user = await mongoose.connection.db.collection('Users').findOne({
        _id: new mongoose.Types.ObjectId(userId)
      });
    }
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Remove password from response
    const { password, ...userWithoutPassword } = user;
    
    res.json({
      success: true,
      id: user.id || user._id,
      username: user.username,
      email: user.email,
      profile: user.profile || {},
      friends: user.friends || [],
      isActive: user.isActive,
      ownedProjects: user.ownedProjects || [],
      memberProjects: user.memberProjects || [],
      commits: user.commits || []
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user profile'
    });
  }
});

// Update user profile
router.put('/users/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.params.id;
    const updateData = req.body;
    
    // Check if user is updating their own profile
    const requestingUser = req.user;
    const requestingUserId = requestingUser.id || requestingUser._id;
    
    if (userId !== requestingUserId) {
      return res.status(403).json({
        success: false,
        message: 'You can only update your own profile'
      });
    }
    
    // Prepare update object
    const update = {
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    
    // Remove fields that shouldn't be updated via this route
    delete update.password;
    delete update._id;
    delete update.id;
    
    const result = await mongoose.connection.db.collection('Users').findOneAndUpdate(
      { id: userId },
      { $set: update },
      { returnDocument: 'after' }
    );
    
    if (!result.value) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    const { password, ...userWithoutPassword } = result.value;
    
    res.json({
      success: true,
      message: 'Profile updated successfully',
      ...userWithoutPassword
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating user profile'
    });
  }
});

module.exports = router;

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');
const User = require('../models/userModel');
const router = express.Router();

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

    const user = await User.db.collection('Users').findOne({ 
      email: { $regex: new RegExp(`^${email}$`, 'i') } 
    });
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

    const token = generateToken(user.id);
    console.log('Generated token:', token ? 'SUCCESS' : 'FAILED');

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

router.post('/register', async (req, res) => {
  try {
    console.log('=== REGISTER REQUEST RECEIVED ===');
    console.log('Request body:', req.body);
    const { username, email, password, profile } = req.body;

    const existingUser = await User.db.collection('Users').findOne({
      $or: [
        { email: { $regex: new RegExp(`^${email}$`, 'i') } }, 
        { username }
      ]
    });
    
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      id: `user_${Date.now()}`,
      username,
      email: email.toLowerCase(),
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

router.get('/verify', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
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

router.delete('/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const userId = decoded.userId;
    
    console.log('=== DELETE PROFILE REQUEST ===');
    console.log('User ID:', userId);

    // Get user to check owned projects
    const user = await User.db.collection('Users').findOne({ id: userId });
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Delete all projects owned by the user
    if (user.ownedProjects && user.ownedProjects.length > 0) {
      await User.db.collection('Projects').deleteMany({
        id: { $in: user.ownedProjects }
      });
      console.log('Deleted projects:', user.ownedProjects.length);
    }

    // Remove user from projects they are a member of
    if (user.memberProjects && user.memberProjects.length > 0) {
      await User.db.collection('Projects').updateMany(
        { id: { $in: user.memberProjects } },
        { $pull: { members: userId } }
      );
      console.log('Removed from member projects:', user.memberProjects.length);
    }

    // Delete all commits by the user
    await User.db.collection('Commits').deleteMany({ userId: userId });
    console.log('Deleted user commits');

    // Remove user from all friend lists
    await User.db.collection('Users').updateMany(
      { friends: userId },
      { $pull: { friends: userId } }
    );
    console.log('Removed from friend lists');

    // Delete all friend requests involving the user
    await User.db.collection('FriendRequests').deleteMany({
      $or: [
        { senderId: userId },
        { receiverId: userId }
      ]
    });
    console.log('Deleted friend requests');

    // Finally, delete the user
    const deleteResult = await User.db.collection('Users').deleteOne({ id: userId });
    
    if (deleteResult.deletedCount === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    console.log('User profile deleted successfully');

    res.json({
      success: true,
      message: 'Profile deleted successfully'
    });
  } catch (error) {
    console.error('Profile deletion error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;

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
    
    
    const { email, password } = req.body;
    

    const user = await User.db.collection('Users').findOne({ 
      email: { $regex: new RegExp(`^${email}$`, 'i') } 
    });
    

    if (!user) {
      
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    

    const isValidPassword = await bcrypt.compare(password, user.password);
    

    if (!isValidPassword) {
      
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    

    const token = generateToken(user.id);
    

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
    
  
    const user = await User.db.collection('Users').findOne({ id: userId });
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.ownedProjects && user.ownedProjects.length > 0) {
      await User.db.collection('Projects').deleteMany({
        id: { $in: user.ownedProjects }
      });
      
    }

    if (user.memberProjects && user.memberProjects.length > 0) {
      await User.db.collection('Projects').updateMany(
        { id: { $in: user.memberProjects } },
        { $pull: { members: userId } }
      );
      
    }
    await User.db.collection('Commits').deleteMany({ userId: userId });
    

    await User.db.collection('Users').updateMany(
      { friends: userId },
      { $pull: { friends: userId } }
    );

    await User.db.collection('FriendRequests').deleteMany({
      $or: [
        { senderId: userId },
        { receiverId: userId }
      ]
    });
    

    const deleteResult = await User.db.collection('Users').deleteOne({ id: userId });
    
    if (deleteResult.deletedCount === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    

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

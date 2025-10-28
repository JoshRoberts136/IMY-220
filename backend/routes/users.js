const express = require('express');
const mongoose = require('mongoose');
const { authenticateToken } = require('../middleware/auth');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const router = express.Router();

// Configure multer inline for this specific route
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads/profile-images');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    const ext = path.extname(file.originalname);
    // Use the userId from params instead of req.user
    cb(null, `${req.params.userId}_${uniqueSuffix}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'));
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: fileFilter
});

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

// Upload profile image - AUTH FIRST, THEN MULTER
router.post('/:userId/profile/avatar', authenticateToken, (req, res, next) => {
  console.log('=== AVATAR UPLOAD START ===');
  console.log('URL userId:', req.params.userId);
  console.log('req.user.id:', req.user?.id);
  
  // Check authorization BEFORE multer processes the file
  const userId = req.params.userId;
  const currentUserId = req.user.id || (req.user._id ? req.user._id.toString() : null);
  
  if (currentUserId !== userId) {
    console.log('AUTHORIZATION FAILED:', currentUserId, 'vs', userId);
    return res.status(403).json({
      success: false,
      message: 'You can only update your own profile picture'
    });
  }
  
  console.log('Authorization passed, processing upload...');
  next();
}, upload.single('avatar'), async (req, res) => {
  try {
    const userId = req.params.userId;
    
    if (!req.file) {
      console.log('ERROR: No file uploaded');
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }
    
    console.log('File uploaded:', req.file.filename);
    
    // Get the user's current avatar to delete old file
    const user = await mongoose.connection.db.collection('Users').findOne({ id: userId });
    
    if (!user) {
      fs.unlinkSync(req.file.path);
      console.log('ERROR: User not found');
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Delete old avatar file if it exists
    if (user.profile && user.profile.avatar) {
      const oldAvatarPath = path.join(__dirname, '../uploads/profile-images', path.basename(user.profile.avatar));
      if (fs.existsSync(oldAvatarPath)) {
        fs.unlinkSync(oldAvatarPath);
        console.log('Deleted old avatar');
      }
    }
    
    // Create the avatar path
    const avatarPath = `/uploads/profile-images/${req.file.filename}`;
    
    // Update database
    await mongoose.connection.db.collection('Users').updateOne(
      { id: userId },
      { 
        $set: { 
          'profile.avatar': avatarPath,
          updatedAt: new Date()
        }
      }
    );
    
    console.log('SUCCESS: Avatar updated to', avatarPath);
    
    res.json({
      success: true,
      message: 'Profile picture updated successfully',
      avatar: avatarPath
    });
    
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({
      success: false,
      message: 'Error uploading profile picture'
    });
  }
});

// Delete profile image
router.delete('/:userId/profile/avatar', authenticateToken, async (req, res) => {
  try {
    const userId = req.params.userId;
    const currentUserId = req.user.id || (req.user._id ? req.user._id.toString() : null);
    
    if (currentUserId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own profile picture'
      });
    }
    
    const user = await mongoose.connection.db.collection('Users').findOne({ id: userId });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Delete avatar file if it exists
    if (user.profile && user.profile.avatar) {
      const avatarPath = path.join(__dirname, '../uploads/profile-images', path.basename(user.profile.avatar));
      if (fs.existsSync(avatarPath)) {
        fs.unlinkSync(avatarPath);
      }
    }
    
    // Remove from database
    await mongoose.connection.db.collection('Users').updateOne(
      { id: userId },
      { 
        $set: { 
          'profile.avatar': null,
          updatedAt: new Date()
        }
      }
    );
    
    res.json({
      success: true,
      message: 'Profile picture deleted successfully'
    });
    
  } catch (error) {
    console.error('Error deleting profile picture:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting profile picture'
    });
  }
});

module.exports = router;

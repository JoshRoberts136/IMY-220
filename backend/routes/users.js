const express = require('express');
const { getDB } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const { uploadProfileImage } = require('../middleware/upload');
const router = express.Router();

const requireAdmin = (req, res, next) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }
  next();
};

router.get('/', authenticateToken, async (req, res) => {
  try {
    const db = getDB();
    const users = await db.collection('Users')
      .find({})
      .project({
        id: 1,
        username: 1,
        email: 1,
        profile: 1,
        isActive: 1,
        isAdmin: 1
      })
      .toArray();
    
    res.json({
      success: true,
      users: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching users'
    });
  }
});

router.get('/:userId', authenticateToken, async (req, res) => {
  try {
    const userId = req.params.userId;
    const db = getDB();
    
    const user = await db.collection('Users').findOne({ id: userId });
    
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
      isAdmin: user.isAdmin || false,
      friends: user.friends || [],
      ownedProjects: user.ownedProjects || [],
      memberProjects: user.memberProjects || []
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user'
    });
  }
});

router.get('/:userId/profile', authenticateToken, async (req, res) => {
  try {
    const userId = req.params.userId;
    const db = getDB();
    
    const user = await db.collection('Users').findOne({ id: userId });
    
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
        isActive: user.isActive,
        isAdmin: user.isAdmin || false
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user profile'
    });
  }
});

router.post('/:userId/profile/avatar', authenticateToken, uploadProfileImage.single('avatar'), async (req, res) => {
  const userId = req.params.userId;
  const currentUserId = req.user.id || (req.user._id ? req.user._id.toString() : null);
  const isAdmin = req.user.isAdmin || false;
  
  if (currentUserId !== userId && !isAdmin) {
    return res.status(403).json({
      success: false,
      message: 'You can only update your own profile picture'
    });
  }
  try {
    const userId = req.params.userId;
    const fs = require('fs');
    const path = require('path');
    const db = getDB();
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }
    
    const user = await db.collection('Users').findOne({ id: userId });
    
    if (!user) {
      fs.unlinkSync(req.file.path);
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    if (user.profile && user.profile.avatar) {
      const oldAvatarPath = path.join(__dirname, '../uploads/profile-images', path.basename(user.profile.avatar));
      if (fs.existsSync(oldAvatarPath)) {
        fs.unlinkSync(oldAvatarPath);
      }
    }
    
    const avatarPath = `/uploads/profile-images/${req.file.filename}`;
    
    await db.collection('Users').updateOne(
      { id: userId },
      { 
        $set: { 
          'profile.avatar': avatarPath,
          updatedAt: new Date()
        }
      }
    );
    
    res.json({
      success: true,
      message: 'Profile picture updated successfully',
      avatar: avatarPath
    });
    
  } catch (error) {
    if (req.file) {
      const fs = require('fs');
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({
      success: false,
      message: 'Error uploading profile picture'
    });
  }
});

router.delete('/:userId/profile/avatar', authenticateToken, async (req, res) => {
  try {
    const userId = req.params.userId;
    const currentUserId = req.user.id || (req.user._id ? req.user._id.toString() : null);
    const isAdmin = req.user.isAdmin || false;
    const db = getDB();
    
    if (currentUserId !== userId && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own profile picture'
      });
    }
    
    const user = await db.collection('Users').findOne({ id: userId });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    if (user.profile && user.profile.avatar) {
      const path = require('path');
      const fs = require('fs');
      const avatarPath = path.join(__dirname, '../uploads/profile-images', path.basename(user.profile.avatar));
      if (fs.existsSync(avatarPath)) {
        fs.unlinkSync(avatarPath);
      }
    }
    
    await db.collection('Users').updateOne(
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
    res.status(500).json({
      success: false,
      message: 'Error deleting profile picture'
    });
  }
});

router.put('/:userId', authenticateToken, async (req, res) => {
  try {
    const userId = req.params.userId;
    const updateData = req.body;
    const currentUserId = req.user.id || (req.user._id ? req.user._id.toString() : null);
    const isAdmin = req.user.isAdmin || false;
    const db = getDB();
    
    if (currentUserId !== userId && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'You can only update your own profile'
      });
    }
    
    delete updateData._id;
    delete updateData.id;
    delete updateData.password;
    
    await db.collection('Users').updateOne(
      { id: userId },
      { 
        $set: {
          ...updateData,
          updatedAt: new Date()
        }
      }
    );
    
    res.json({
      success: true,
      message: 'User updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating user'
    });
  }
});

router.delete('/:userId', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const userId = req.params.userId;
    const db = getDB();
    
    const user = await db.collection('Users').findOne({ id: userId });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.ownedProjects && user.ownedProjects.length > 0) {
      for (const projectId of user.ownedProjects) {
        const project = await db.collection('Projects').findOne({ id: projectId });
        
        if (project) {
          const otherMembers = (project.members || []).filter(memberId => memberId !== userId);
          
          if (otherMembers.length > 0) {
            const randomMember = otherMembers[Math.floor(Math.random() * otherMembers.length)];
            
            await db.collection('Projects').updateOne(
              { id: projectId },
              { 
                $set: { 
                  ownedBy: randomMember,
                  updatedAt: new Date().toISOString()
                }
              }
            );
          } else {
            await db.collection('Projects').deleteOne({ id: projectId });
          }
        }
      }
    }

    if (user.memberProjects && user.memberProjects.length > 0) {
      await db.collection('Projects').updateMany(
        { id: { $in: user.memberProjects } },
        { $pull: { members: userId } }
      );
    }
    
    await db.collection('Commits').deleteMany({ userId: userId });

    await db.collection('Users').updateMany(
      { friends: userId },
      { $pull: { friends: userId } }
    );

    await db.collection('FriendRequests').deleteMany({
      $or: [
        { senderId: userId },
        { receiverId: userId }
      ]
    });

    await db.collection('Users').deleteOne({ id: userId });
    
    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting user'
    });
  }
});

module.exports = router;

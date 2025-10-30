const express = require('express');
const mongoose = require('mongoose');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

router.get('/', authenticateToken, async (req, res) => {
  try {
    const user = req.user;
    const userId = user.id || user._id?.toString();
    
    const currentUser = await mongoose.connection.db.collection('Users').findOne({ id: userId });
    
    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    const friendIds = currentUser.friends || [];
    
    if (friendIds.length === 0) {
      return res.json({
        success: true,
        friends: []
      });
    }
    
    const allProjects = await mongoose.connection.db.collection('Projects').find({}).toArray();
    
    const friends = await Promise.all(friendIds.map(async (friendId) => {
      const friendUser = await mongoose.connection.db.collection('Users').findOne({ id: friendId });
      
      if (!friendUser) {
        return null;
      }
      
      const mutualProjects = allProjects.filter(project => {
        const members = project.members || [];
        const hasCurrentUser = members.includes(userId);
        const hasFriend = members.includes(friendId);
        return hasCurrentUser && hasFriend;
      });
      
      return {
        id: friendUser.id,
        _id: friendUser._id,
        username: friendUser.username,
        email: friendUser.email,
        profile: friendUser.profile,
        isActive: friendUser.isActive,
        status: friendUser.isActive ? 'online' : 'offline',
        avatar: friendUser.profile?.avatar || '👤',
        title: friendUser.profile?.title || 'Developer',
        mutualProjects: mutualProjects.length
      };
    }));
    
    const validFriends = friends.filter(friend => friend !== null);
    
    res.json({
      success: true,
      friends: validFriends
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching friends'
    });
  }
});

router.get('/status/:userId', authenticateToken, async (req, res) => {
  try {
    const currentUser = req.user;
    const currentUserId = currentUser.id || currentUser._id?.toString();
    const targetUserId = req.params.userId;
    
    if (currentUserId === targetUserId) {
      return res.json({
        success: true,
        status: 'self'
      });
    }
    
    const user = await mongoose.connection.db.collection('Users').findOne({ id: currentUserId });
    
    if (!user) {
      return res.json({
        success: true,
        status: 'none'
      });
    }
    
    const friendIds = user.friends || [];
    const isFriend = friendIds.includes(targetUserId);
    
    res.json({
      success: true,
      status: isFriend ? 'friends' : 'none'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error checking friendship status'
    });
  }
});

router.post('/add', authenticateToken, async (req, res) => {
  try {
    const { friendId } = req.body;
    const currentUser = req.user;
    const userId = currentUser.id || currentUser._id?.toString();
    
    if (friendId === userId) {
      return res.status(400).json({
        success: false,
        message: 'You cannot add yourself as a friend'
      });
    }
    
    const friendUser = await mongoose.connection.db.collection('Users').findOne({ id: friendId });
    if (!friendUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    const user = await mongoose.connection.db.collection('Users').findOne({ id: userId });
    const friendIds = user.friends || [];
    
    if (friendIds.includes(friendId)) {
      return res.status(400).json({
        success: false,
        message: 'You are already friends with this user'
      });
    }
    
    await mongoose.connection.db.collection('Users').updateOne(
      { id: userId },
      { $push: { friends: friendId } }
    );
    
    await mongoose.connection.db.collection('Users').updateOne(
      { id: friendId },
      { $push: { friends: userId } }
    );
    
    res.json({
      success: true,
      message: 'Friend added successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding friend'
    });
  }
});

router.delete('/:friendId', authenticateToken, async (req, res) => {
  try {
    const { friendId } = req.params;
    const currentUser = req.user;
    const userId = currentUser.id || currentUser._id?.toString();
    
    await mongoose.connection.db.collection('Users').updateOne(
      { id: userId },
      { $pull: { friends: friendId } }
    );
    
    await mongoose.connection.db.collection('Users').updateOne(
      { id: friendId },
      { $pull: { friends: userId } }
    );
    
    res.json({
      success: true,
      message: 'Friend removed successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error removing friend'
    });
  }
});

router.get('/mutual-projects/:friendId', authenticateToken, async (req, res) => {
  try {
    const currentUser = req.user;
    const userId = currentUser.id || currentUser._id?.toString();
    const friendId = req.params.friendId;
    
    const mutualProjects = await mongoose.connection.db.collection('Projects')
      .find({
        members: { $all: [userId, friendId] }
      })
      .toArray();
    
    const projectsWithOwners = await Promise.all(
      mutualProjects.map(async (project) => {
        const owner = await mongoose.connection.db.collection('Users').findOne({
          id: project.ownedBy
        });
        
        return {
          id: project.id,
          _id: project._id,
          name: project.name,
          description: project.description,
          language: project.language,
          stars: project.stars || 0,
          forks: project.forks || 0,
          hashtags: project.hashtags || [],
          ownedBy: project.ownedBy,
          ownerName: owner ? owner.username : 'Unknown',
          ownerAvatar: owner ? (owner.profile?.avatar || '👤') : '👤',
          members: project.members || [],
          lastUpdated: project.lastUpdated,
          createdAt: project.createdAt
        };
      })
    );
    
    res.json({
      success: true,
      projects: projectsWithOwners
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching mutual projects'
    });
  }
});

module.exports = router;

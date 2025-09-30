const express = require('express');
const mongoose = require('mongoose');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// Get friends list - reads from User's friends array
router.get('/', authenticateToken, async (req, res) => {
  try {
    const user = req.user;
    const userId = user.id || user._id?.toString();
    
    console.log('=== FETCHING FRIENDS ===');
    console.log('User ID:', userId);
    
    // Get the current user to access their friends array
    const currentUser = await mongoose.connection.db.collection('Users').findOne({ id: userId });
    
    if (!currentUser) {
      console.log('User not found');
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    const friendIds = currentUser.friends || [];
    console.log('Friend IDs from user.friends array:', friendIds);
    
    if (friendIds.length === 0) {
      console.log('No friends found');
      return res.json({
        success: true,
        friends: []
      });
    }
    
    // Get all projects to calculate mutual projects
    const allProjects = await mongoose.connection.db.collection('Projects').find({}).toArray();
    console.log('Total projects in database:', allProjects.length);
    
    // Get friend user info for each friend ID
    const friends = await Promise.all(friendIds.map(async (friendId) => {
      const friendUser = await mongoose.connection.db.collection('Users').findOne({ id: friendId });
      
      if (!friendUser) {
        console.log('Friend not found:', friendId);
        return null;
      }
      
      // Calculate mutual projects (projects where both users are members)
      const mutualProjects = allProjects.filter(project => {
        const members = project.members || [];
        const hasCurrentUser = members.includes(userId);
        const hasFriend = members.includes(friendId);
        return hasCurrentUser && hasFriend;
      });
      
      console.log(`Found friend: ${friendUser.username}, mutual projects: ${mutualProjects.length}`);
      
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
    
    // Filter out any null values (users that weren't found)
    const validFriends = friends.filter(friend => friend !== null);
    
    console.log('Returning friends:', validFriends.length);
    
    res.json({
      success: true,
      friends: validFriends
    });
  } catch (error) {
    console.error('Error fetching friends:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching friends'
    });
  }
});

// Check friendship status with a specific user
router.get('/status/:userId', authenticateToken, async (req, res) => {
  try {
    const currentUser = req.user;
    const currentUserId = currentUser.id || currentUser._id?.toString();
    const targetUserId = req.params.userId;
    
    console.log('Checking friendship status:', { currentUserId, targetUserId });
    
    if (currentUserId === targetUserId) {
      return res.json({
        success: true,
        status: 'self'
      });
    }
    
    // Get current user's friends array
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
    console.error('Error checking friendship status:', error);
    res.status(500).json({
      success: false,
      message: 'Error checking friendship status'
    });
  }
});

// Add friend (simplified - directly adds to friends array)
router.post('/add', authenticateToken, async (req, res) => {
  try {
    const { friendId } = req.body;
    const currentUser = req.user;
    const userId = currentUser.id || currentUser._id?.toString();
    
    console.log('=== ADDING FRIEND ===');
    console.log('Current user:', userId);
    console.log('Friend to add:', friendId);
    
    if (friendId === userId) {
      return res.status(400).json({
        success: false,
        message: 'You cannot add yourself as a friend'
      });
    }
    
    // Check if friend user exists
    const friendUser = await mongoose.connection.db.collection('Users').findOne({ id: friendId });
    if (!friendUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Get current user
    const user = await mongoose.connection.db.collection('Users').findOne({ id: userId });
    const friendIds = user.friends || [];
    
    // Check if already friends
    if (friendIds.includes(friendId)) {
      return res.status(400).json({
        success: false,
        message: 'You are already friends with this user'
      });
    }
    
    // Add friend to both users' friends arrays
    await mongoose.connection.db.collection('Users').updateOne(
      { id: userId },
      { $push: { friends: friendId } }
    );
    
    await mongoose.connection.db.collection('Users').updateOne(
      { id: friendId },
      { $push: { friends: userId } }
    );
    
    console.log('Friend added successfully');
    
    res.json({
      success: true,
      message: 'Friend added successfully'
    });
  } catch (error) {
    console.error('Error adding friend:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding friend'
    });
  }
});

// Remove friend
router.delete('/:friendId', authenticateToken, async (req, res) => {
  try {
    const { friendId } = req.params;
    const currentUser = req.user;
    const userId = currentUser.id || currentUser._id?.toString();
    
    console.log('=== REMOVING FRIEND ===');
    console.log('Current user:', userId);
    console.log('Friend to remove:', friendId);
    
    // Remove friend from both users' friends arrays
    await mongoose.connection.db.collection('Users').updateOne(
      { id: userId },
      { $pull: { friends: friendId } }
    );
    
    await mongoose.connection.db.collection('Users').updateOne(
      { id: friendId },
      { $pull: { friends: userId } }
    );
    
    console.log('Friend removed successfully');
    
    res.json({
      success: true,
      message: 'Friend removed successfully'
    });
  } catch (error) {
    console.error('Error removing friend:', error);
    res.status(500).json({
      success: false,
      message: 'Error removing friend'
    });
  }
});

// Get mutual projects with a friend
router.get('/mutual-projects/:friendId', authenticateToken, async (req, res) => {
  try {
    const currentUser = req.user;
    const userId = currentUser.id || currentUser._id?.toString();
    const friendId = req.params.friendId;
    
    console.log('Finding mutual projects between:', { userId, friendId });
    
    // Find all projects where both users are members
    const mutualProjects = await mongoose.connection.db.collection('Projects')
      .find({
        members: { $all: [userId, friendId] }
      })
      .toArray();
    
    console.log('Found mutual projects:', mutualProjects.length);
    
    // Get owner info for each project
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
    console.error('Error fetching mutual projects:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching mutual projects'
    });
  }
});

module.exports = router;

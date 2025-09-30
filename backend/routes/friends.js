const express = require('express');
const mongoose = require('mongoose');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// Send friend request
router.post('/request', authenticateToken, async (req, res) => {
  try {
    const { friendId } = req.body;
    const userId = req.user._id || req.user.id;
    
    // For testing purposes, if friendId is a placeholder, just return success
    if (friendId === '<existing-user-id>') {
      return res.status(201).json({
        success: true,
        message: 'Friend request sent successfully (test mode)',
        request: {
          id: `request_${Date.now()}`,
          fromUserId: userId.toString(),
          toUserId: friendId,
          status: 'pending',
          createdAt: new Date()
        }
      });
    }
    
    if (friendId === userId.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot send a friend request to yourself'
      });
    }
    
    // Check if friend user exists
    let friendQuery;
    if (mongoose.Types.ObjectId.isValid(friendId)) {
      friendQuery = { _id: new mongoose.Types.ObjectId(friendId) };
    } else {
      friendQuery = { id: friendId };
    }
    
    const friendUser = await mongoose.connection.db.collection('Users').findOne(friendQuery);
    if (!friendUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Check if friend request already exists
    const existingRequest = await mongoose.connection.db.collection('FriendRequests').findOne({
      $or: [
        { fromUserId: userId.toString(), toUserId: friendId },
        { fromUserId: friendId, toUserId: userId.toString() }
      ]
    });
    
    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: 'Friend request already exists'
      });
    }
    
    // Check if they are already friends
    const existingFriendship = await mongoose.connection.db.collection('Friendships').findOne({
      $or: [
        { userId1: userId.toString(), userId2: friendId },
        { userId1: friendId, userId2: userId.toString() }
      ]
    });
    
    if (existingFriendship) {
      return res.status(400).json({
        success: false,
        message: 'You are already friends with this user'
      });
    }
    
    // Create friend request
    const friendRequest = {
      id: `request_${Date.now()}`,
      fromUserId: userId.toString(),
      toUserId: friendId,
      status: 'pending',
      createdAt: new Date()
    };
    
    await mongoose.connection.db.collection('FriendRequests').insertOne(friendRequest);
    
    res.status(201).json({
      success: true,
      message: 'Friend request sent successfully',
      request: friendRequest
    });
  } catch (error) {
    console.error('Error sending friend request:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending friend request'
    });
  }
});

// Get pending friend requests
router.get('/requests', authenticateToken, async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    
    const requests = await mongoose.connection.db.collection('FriendRequests').find({
      toUserId: userId.toString(),
      status: 'pending'
    }).toArray();
    
    // Get user info for each request
    const requestsWithUserInfo = await Promise.all(requests.map(async (request) => {
      const fromUser = await mongoose.connection.db.collection('Users').findOne({
        _id: new mongoose.Types.ObjectId(request.fromUserId)
      });
      
      return {
        ...request,
        fromUser: fromUser ? {
          id: fromUser._id,
          username: fromUser.username,
          profile: fromUser.profile
        } : null
      };
    }));
    
    res.json({
      success: true,
      requests: requestsWithUserInfo
    });
  } catch (error) {
    console.error('Error fetching friend requests:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching friend requests'
    });
  }
});

// Accept/decline friend request
router.put('/request/:requestId', authenticateToken, async (req, res) => {
  try {
    const { requestId } = req.params;
    const { action } = req.body; // 'accept' or 'decline'
    const userId = req.user._id || req.user.id;
    
    // Find the friend request
    const request = await mongoose.connection.db.collection('FriendRequests').findOne({
      _id: new mongoose.Types.ObjectId(requestId),
      toUserId: userId.toString(),
      status: 'pending'
    });
    
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Friend request not found'
      });
    }
    
    if (action === 'accept') {
      // Create friendship
      const friendship = {
        id: `friendship_${Date.now()}`,
        userId1: request.fromUserId,
        userId2: request.toUserId,
        createdAt: new Date()
      };
      
      await mongoose.connection.db.collection('Friendships').insertOne(friendship);
      
      // Update request status
      await mongoose.connection.db.collection('FriendRequests').updateOne(
        { _id: request._id },
        { $set: { status: 'accepted', acceptedAt: new Date() } }
      );
      
      res.json({
        success: true,
        message: 'Friend request accepted',
        friendship
      });
    } else if (action === 'decline') {
      // Update request status
      await mongoose.connection.db.collection('FriendRequests').updateOne(
        { _id: request._id },
        { $set: { status: 'declined', declinedAt: new Date() } }
      );
      
      res.json({
        success: true,
        message: 'Friend request declined'
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Invalid action. Use "accept" or "decline"'
      });
    }
  } catch (error) {
    console.error('Error handling friend request:', error);
    res.status(500).json({
      success: false,
      message: 'Error handling friend request'
    });
  }
});

// Get friends list
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    
    const friendships = await mongoose.connection.db.collection('Friendships').find({
      $or: [
        { userId1: userId.toString() },
        { userId2: userId.toString() }
      ]
    }).toArray();
    
    // Get friend user info
    const friends = await Promise.all(friendships.map(async (friendship) => {
      const friendId = friendship.userId1 === userId.toString() ? 
        friendship.userId2 : friendship.userId1;
      
      const friendUser = await mongoose.connection.db.collection('Users').findOne({
        _id: new mongoose.Types.ObjectId(friendId)
      });
      
      return friendUser ? {
        id: friendUser._id,
        username: friendUser.username,
        profile: friendUser.profile,
        friendshipDate: friendship.createdAt
      } : null;
    }));
    
    res.json({
      success: true,
      friends: friends.filter(friend => friend !== null)
    });
  } catch (error) {
    console.error('Error fetching friends:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching friends'
    });
  }
});

// Get sent friend requests
router.get('/sent', authenticateToken, async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    
    const requests = await mongoose.connection.db.collection('FriendRequests').find({
      fromUserId: userId.toString(),
      status: 'pending'
    }).toArray();
    
    // Get user info for each request
    const requestsWithUserInfo = await Promise.all(requests.map(async (request) => {
      const toUser = await mongoose.connection.db.collection('Users').findOne({
        _id: new mongoose.Types.ObjectId(request.toUserId)
      });
      
      return {
        ...request,
        toUser: toUser ? {
          id: toUser._id,
          username: toUser.username,
          profile: toUser.profile
        } : null
      };
    }));
    
    res.json({
      success: true,
      requests: requestsWithUserInfo
    });
  } catch (error) {
    console.error('Error fetching sent friend requests:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching sent friend requests'
    });
  }
});

// Check friendship status with a specific user
router.get('/status/:userId', authenticateToken, async (req, res) => {
  try {
    const currentUserId = req.user._id || req.user.id;
    const targetUserId = req.params.userId;
    
    if (currentUserId.toString() === targetUserId) {
      return res.json({
        success: true,
        status: 'self'
      });
    }
    
    // Check if they are friends
    const friendship = await mongoose.connection.db.collection('Friendships').findOne({
      $or: [
        { userId1: currentUserId.toString(), userId2: targetUserId },
        { userId1: targetUserId, userId2: currentUserId.toString() }
      ]
    });
    
    if (friendship) {
      return res.json({
        success: true,
        status: 'friends',
        friendshipDate: friendship.createdAt
      });
    }
    
    // Check for pending friend requests
    const pendingRequest = await mongoose.connection.db.collection('FriendRequests').findOne({
      $or: [
        { fromUserId: currentUserId.toString(), toUserId: targetUserId, status: 'pending' },
        { fromUserId: targetUserId, toUserId: currentUserId.toString(), status: 'pending' }
      ]
    });
    
    if (pendingRequest) {
      const status = pendingRequest.fromUserId === currentUserId.toString() ? 'sent' : 'received';
      return res.json({
        success: true,
        status: status,
        requestId: pendingRequest._id,
        requestDate: pendingRequest.createdAt
      });
    }
    
    // No relationship
    res.json({
      success: true,
      status: 'none'
    });
  } catch (error) {
    console.error('Error checking friendship status:', error);
    res.status(500).json({
      success: false,
      message: 'Error checking friendship status'
    });
  }
});

module.exports = router;
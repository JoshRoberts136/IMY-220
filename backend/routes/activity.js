const express = require('express');
const mongoose = require('mongoose');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// Get local activity feed (user's own activities + friends' activities)
router.get('/local', authenticateToken, async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const limit = parseInt(req.query.limit) || 20;
    const skip = parseInt(req.query.skip) || 0;
    
    // For demo purposes, if no activities exist, return empty array with success
    let activitiesWithUserInfo = [];
    
    // Try to get user's friends (gracefully handle if collections don't exist)
    let friendIds = [];
    try {
      const friendships = await mongoose.connection.db.collection('Friendships').find({
        $or: [
          { userId1: userId.toString() },
          { userId2: userId.toString() }
        ]
      }).toArray();
      
      friendIds = friendships.map(friendship => 
        friendship.userId1 === userId.toString() ? friendship.userId2 : friendship.userId1
      );
    } catch (friendError) {
      console.log('No friendships collection or error:', friendError.message);
    }
    
    // Include user's own ID in the list
    const userIds = [userId.toString(), ...friendIds];
    
    // Try to get activities from user and friends
    let activitiesFromDb = [];
    try {
      activitiesFromDb = await mongoose.connection.db.collection('Activities').find({
        userId: { $in: userIds }
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();
    } catch (activityError) {
      console.log('No activities collection or error:', activityError.message);
    }
    
    // Get user info for each activity
    if (activitiesFromDb.length > 0) {
      activitiesWithUserInfo = await Promise.all(activitiesFromDb.map(async (activity) => {
        let user = null;
        try {
          user = await mongoose.connection.db.collection('Users').findOne({
            _id: new mongoose.Types.ObjectId(activity.userId)
          });
        } catch (userError) {
          console.log('Error fetching user for activity:', userError.message);
        }
        
        return {
          ...activity,
          user: user ? {
            id: user._id,
            username: user.username,
            profile: user.profile
          } : null
        };
      }));
    }
    
    res.json({
      success: true,
      activities: activitiesWithUserInfo
    });
  } catch (error) {
    console.error('Error fetching local activity feed:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching local activity feed'
    });
  }
});

// Get global activity feed (all public activities)
router.get('/global', authenticateToken, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const skip = parseInt(req.query.skip) || 0;
    
    // For demo purposes, return empty array with success if no activities
    let activitiesWithUserInfo = [];
    
    // Try to get all public activities
    let activitiesFromDb = [];
    try {
      activitiesFromDb = await mongoose.connection.db.collection('Activities').find({
        isPublic: { $ne: false } // Include activities that are public or don't have isPublic field
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();
    } catch (activityError) {
      console.log('No activities collection or error:', activityError.message);
    }
    
    // Get user info for each activity
    if (activitiesFromDb.length > 0) {
      activitiesWithUserInfo = await Promise.all(activitiesFromDb.map(async (activity) => {
        let user = null;
        try {
          user = await mongoose.connection.db.collection('Users').findOne({
            _id: new mongoose.Types.ObjectId(activity.userId)
          });
        } catch (userError) {
          console.log('Error fetching user for activity:', userError.message);
        }
        
        return {
          ...activity,
          user: user ? {
            id: user._id,
            username: user.username,
            profile: user.profile
          } : null
        };
      }));
    }
    
    res.json({
      success: true,
      activities: activitiesWithUserInfo
    });
  } catch (error) {
    console.error('Error fetching global activity feed:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching global activity feed'
    });
  }
});

// Create activity (helper function that can be called from other routes)
const createActivity = async (userId, type, description, data = {}) => {
  try {
    const activity = {
      id: `activity_${Date.now()}`,
      userId: userId.toString(),
      type,
      description,
      data,
      isPublic: true,
      createdAt: new Date()
    };
    
    await mongoose.connection.db.collection('Activities').insertOne(activity);
    return activity;
  } catch (error) {
    console.error('Error creating activity:', error);
    return null;
  }
};

// Add activity manually (for testing)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { type, description, data, isPublic } = req.body;
    const userId = req.user._id || req.user.id;
    
    const activity = {
      id: `activity_${Date.now()}`,
      userId: userId.toString(),
      type: type || 'custom',
      description: description || 'User activity',
      data: data || {},
      isPublic: isPublic !== false,
      createdAt: new Date()
    };
    
    const result = await mongoose.connection.db.collection('Activities').insertOne(activity);
    
    res.status(201).json({
      success: true,
      message: 'Activity created successfully',
      activity: {
        ...activity,
        _id: result.insertedId
      }
    });
  } catch (error) {
    console.error('Error creating activity:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating activity'
    });
  }
});

module.exports = { router, createActivity };

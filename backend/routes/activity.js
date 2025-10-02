const express = require('express');
const mongoose = require('mongoose');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

router.get('/local', authenticateToken, async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const limit = parseInt(req.query.limit) || 20;
    const skip = parseInt(req.query.skip) || 0;
    let activitiesWithUserInfo = [];
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
    
    const userIds = [userId.toString(), ...friendIds];
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

router.get('/global', authenticateToken, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const skip = parseInt(req.query.skip) || 0;
    let activitiesWithUserInfo = [];
    let activitiesFromDb = [];
    try {
      activitiesFromDb = await mongoose.connection.db.collection('Activities').find({
        isPublic: { $ne: false } 
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();
    } catch (activityError) {
      console.log('No activities collection or error:', activityError.message);
    }

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

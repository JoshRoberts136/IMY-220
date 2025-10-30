const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { requireAdmin } = require('../middleware/auth');

router.get('/users', requireAdmin, async (req, res) => {
  try {
    const users = await mongoose.connection.db.collection('Users')
      .find({})
      .project({ password: 0 })
      .toArray();
    
    res.json({
      success: true,
      users: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch users',
      message: error.message
    });
  }
});

router.put('/users/:userId', requireAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    const updates = req.body;
    
    delete updates.password;
    updates.updatedAt = new Date();
    
    let result;
    if (mongoose.Types.ObjectId.isValid(userId)) {
      result = await mongoose.connection.db.collection('Users').updateOne(
        { _id: new mongoose.Types.ObjectId(userId) },
        { $set: updates }
      );
    } else {
      result = await mongoose.connection.db.collection('Users').updateOne(
        { id: userId },
        { $set: updates }
      );
    }
    
    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    res.json({
      success: true,
      message: 'User updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update user',
      message: error.message
    });
  }
});

router.delete('/users/:userId', requireAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    
    let user;
    if (mongoose.Types.ObjectId.isValid(userId)) {
      user = await mongoose.connection.db.collection('Users').findOne({
        _id: new mongoose.Types.ObjectId(userId)
      });
    } else {
      user = await mongoose.connection.db.collection('Users').findOne({
        id: userId
      });
    }
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    await mongoose.connection.db.collection('Projects').deleteMany({ ownerId: user.id });
    await mongoose.connection.db.collection('Messages').deleteMany({ userId: user.id });
    await mongoose.connection.db.collection('Commits').deleteMany({ userId: user.id });
    
    if (mongoose.Types.ObjectId.isValid(userId)) {
      await mongoose.connection.db.collection('Users').deleteOne({
        _id: new mongoose.Types.ObjectId(userId)
      });
    } else {
      await mongoose.connection.db.collection('Users').deleteOne({
        id: userId
      });
    }
    
    res.json({
      success: true,
      message: 'User and associated data deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to delete user',
      message: error.message
    });
  }
});

router.get('/projects', requireAdmin, async (req, res) => {
  try {
    const projects = await mongoose.connection.db.collection('Projects')
      .find({})
      .toArray();
    
    res.json({
      success: true,
      projects: projects
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch projects',
      message: error.message
    });
  }
});

router.put('/projects/:projectId', requireAdmin, async (req, res) => {
  try {
    const { projectId } = req.params;
    const updates = req.body;
    
    updates.updatedAt = new Date();
    
    const result = await mongoose.connection.db.collection('Projects').updateOne(
      { id: projectId },
      { $set: updates }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Project updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update project',
      message: error.message
    });
  }
});

router.delete('/projects/:projectId', requireAdmin, async (req, res) => {
  try {
    const { projectId } = req.params;
    
    await mongoose.connection.db.collection('Projects').deleteOne({ id: projectId });
    await mongoose.connection.db.collection('Messages').deleteMany({ projectId: projectId });
    await mongoose.connection.db.collection('Commits').deleteMany({ projectId: projectId });
    
    res.json({
      success: true,
      message: 'Project and associated data deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to delete project',
      message: error.message
    });
  }
});

router.get('/messages', requireAdmin, async (req, res) => {
  try {
    const messages = await mongoose.connection.db.collection('Messages')
      .find({})
      .sort({ timestamp: -1 })
      .toArray();
    
    res.json({
      success: true,
      messages: messages
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch messages',
      message: error.message
    });
  }
});

router.delete('/messages/:messageId', requireAdmin, async (req, res) => {
  try {
    const { messageId } = req.params;
    
    let result;
    if (mongoose.Types.ObjectId.isValid(messageId)) {
      result = await mongoose.connection.db.collection('Messages').deleteOne({
        _id: new mongoose.Types.ObjectId(messageId)
      });
    } else {
      result = await mongoose.connection.db.collection('Messages').deleteOne({
        id: messageId
      });
    }
    
    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        error: 'Message not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to delete message',
      message: error.message
    });
  }
});

router.get('/commits', requireAdmin, async (req, res) => {
  try {
    const commits = await mongoose.connection.db.collection('Commits')
      .find({})
      .sort({ timestamp: -1 })
      .toArray();
    
    res.json({
      success: true,
      commits: commits
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch commits',
      message: error.message
    });
  }
});

router.delete('/commits/:commitId', requireAdmin, async (req, res) => {
  try {
    const { commitId } = req.params;
    
    const result = await mongoose.connection.db.collection('Commits').deleteOne({
      id: commitId
    });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        error: 'Commit not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Commit deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to delete commit',
      message: error.message
    });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const { getDB } = require('../config/database');
const { ObjectId } = require('mongodb');
const { requireAdmin } = require('../middleware/auth');

router.get('/users', requireAdmin, async (req, res) => {
  try {
    const db = getDB();
    const users = await db.collection('Users')
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
    const db = getDB();
    const { userId } = req.params;
    const updates = req.body;
    
    delete updates.password;
    updates.updatedAt = new Date();
    
    let result;
    if (ObjectId.isValid(userId)) {
      result = await db.collection('Users').updateOne(
        { _id: new ObjectId(userId) },
        { $set: updates }
      );
    } else {
      result = await db.collection('Users').updateOne(
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
    const db = getDB();
    const { userId } = req.params;
    
    let user;
    if (ObjectId.isValid(userId)) {
      user = await db.collection('Users').findOne({
        _id: new ObjectId(userId)
      });
    } else {
      user = await db.collection('Users').findOne({
        id: userId
      });
    }
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    await db.collection('Projects').deleteMany({ ownerId: user.id });
    await db.collection('Messages').deleteMany({ userId: user.id });
    await db.collection('Commits').deleteMany({ userId: user.id });
    
    if (ObjectId.isValid(userId)) {
      await db.collection('Users').deleteOne({
        _id: new ObjectId(userId)
      });
    } else {
      await db.collection('Users').deleteOne({
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
    const db = getDB();
    const projects = await db.collection('Projects')
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
    const db = getDB();
    const { projectId } = req.params;
    const updates = req.body;
    
    updates.updatedAt = new Date();
    
    const result = await db.collection('Projects').updateOne(
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
    const db = getDB();
    const { projectId } = req.params;
    
    await db.collection('Projects').deleteOne({ id: projectId });
    await db.collection('Messages').deleteMany({ projectId: projectId });
    await db.collection('Commits').deleteMany({ projectId: projectId });
    
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
    const db = getDB();
    const messages = await db.collection('Messages')
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
    const db = getDB();
    const { messageId } = req.params;
    
    let result;
    if (ObjectId.isValid(messageId)) {
      result = await db.collection('Messages').deleteOne({
        _id: new ObjectId(messageId)
      });
    } else {
      result = await db.collection('Messages').deleteOne({
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
    const db = getDB();
    const commits = await db.collection('Commits')
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
    const db = getDB();
    const { commitId } = req.params;
    
    const result = await db.collection('Commits').deleteOne({
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

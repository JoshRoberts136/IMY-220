const express = require('express');
const mongoose = require('mongoose');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// Create a new commit
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { message, filesChanged, projectId, author, userId } = req.body;
    
    // Validate required fields
    if (!message || !projectId || !author || !userId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Check if project exists
    const project = await mongoose.connection.db.collection('Projects').findOne({ 
      id: projectId 
    });
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check if user is owner or member
    const isOwner = project.ownedBy === userId;
    const isMember = project.members && project.members.includes(userId);
    
    if (!isOwner && !isMember) {
      return res.status(403).json({
        success: false,
        message: 'You must be a project owner or member to create commits'
      });
    }

    // Generate unique ID and hash
    const commitId = Date.now();
    const hash = `${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
    
    const newCommit = {
      id: commitId,
      hash: hash,
      message: message,
      author: author,
      userId: userId,
      timestamp: new Date().toISOString(),
      filesChanged: filesChanged || 1,
      projectId: projectId
    };
    
    // Insert commit into Commits collection
    await mongoose.connection.db.collection('Commits').insertOne(newCommit);
    
    // Update project's commits array
    await mongoose.connection.db.collection('Projects').updateOne(
      { id: projectId },
      { 
        $push: { commits: newCommit },
        $set: { lastUpdated: new Date().toISOString() }
      }
    );
    
    // Get user info for the response
    const user = await mongoose.connection.db.collection('Users').findOne({ id: userId });
    
    res.status(201).json({
      success: true,
      message: 'Commit created successfully',
      commit: {
        ...newCommit,
        userAvatar: user ? (user.profile?.avatar || '👤') : '👤',
        username: user ? user.username : author
      }
    });
  } catch (error) {
    console.error('Error creating commit:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating commit'
    });
  }
});

// Get all commits for a project
router.get('/project/:projectId', authenticateToken, async (req, res) => {
  try {
    const projectId = req.params.projectId;
    
    const commits = await mongoose.connection.db.collection('Commits')
      .find({ projectId: projectId })
      .sort({ timestamp: -1 })
      .toArray();
    
    // Get user info for each commit
    const commitsWithUsers = await Promise.all(
      commits.map(async (commit) => {
        const user = await mongoose.connection.db.collection('Users').findOne({
          id: commit.userId
        });
        return {
          ...commit,
          userAvatar: user ? (user.profile?.avatar || '👤') : '👤',
          username: user ? user.username : commit.author
        };
      })
    );
    
    res.json({
      success: true,
      commits: commitsWithUsers
    });
  } catch (error) {
    console.error('Error fetching commits:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching commits'
    });
  }
});

// Get all commits by a user
router.get('/user/:userId', authenticateToken, async (req, res) => {
  try {
    const userId = req.params.userId;
    
    const commits = await mongoose.connection.db.collection('Commits')
      .find({ userId: userId })
      .sort({ timestamp: -1 })
      .toArray();
    
    // Get project names for commits
    const commitsWithProjects = await Promise.all(
      commits.map(async (commit) => {
        const project = await mongoose.connection.db.collection('Projects').findOne({
          id: commit.projectId
        });
        return {
          ...commit,
          projectName: project ? project.name : 'Unknown Project'
        };
      })
    );
    
    res.json({
      success: true,
      commits: commitsWithProjects
    });
  } catch (error) {
    console.error('Error fetching user commits:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user commits'
    });
  }
});

module.exports = router;

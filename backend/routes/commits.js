const express = require('express');
const { getDB } = require('../config/database');
const { ObjectId } = require('mongodb');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

router.post('/', authenticateToken, async (req, res) => {
  try {
    const db = getDB();
    const { message, filesChanged, projectId, author, userId } = req.body;
    
    if (!message || !projectId || !author || !userId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    const project = await db.collection('Projects').findOne({ 
      id: projectId 
    });
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    const isOwner = project.ownedBy === userId;
    const isMember = project.members && project.members.includes(userId);
    
    if (!isOwner && !isMember) {
      return res.status(403).json({
        success: false,
        message: 'You must be a project owner or member to create commits'
      });
    }

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
    
    await db.collection('Commits').insertOne(newCommit);

    await db.collection('Projects').updateOne(
      { id: projectId },
      { 
        $push: { commits: newCommit },
        $set: { lastUpdated: new Date().toISOString() }
      }
    );
    
    const user = await db.collection('Users').findOne({ id: userId });
    
    res.status(201).json({
      success: true,
      message: 'Commit created successfully',
      commit: {
        ...newCommit,
        userAvatar: user ? (user.profile?.avatar || '👤') : '👤',
        username: user ? user.username : author,
        projectImage: project.image || '💻',
        projectName: project.name
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating commit'
    });
  }
});


router.get('/project/:projectId', authenticateToken, async (req, res) => {
  try {
    const db = getDB();
    const projectId = req.params.projectId;
    
    const commits = await db.collection('Commits')
      .find({ projectId: projectId })
      .sort({ timestamp: -1 })
      .toArray();

    const commitsWithUsers = await Promise.all(
      commits.map(async (commit) => {
        const user = await db.collection('Users').findOne({
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
    res.status(500).json({
      success: false,
      message: 'Error fetching commits'
    });
  }
});

router.get('/user/:userId', authenticateToken, async (req, res) => {
  try {
    const db = getDB();
    const userId = req.params.userId;
    
    const commits = await db.collection('Commits')
      .find({ userId: userId })
      .sort({ timestamp: -1 })
      .toArray();
    
    const commitsWithProjects = await Promise.all(
      commits.map(async (commit) => {
        const project = await db.collection('Projects').findOne({
          id: commit.projectId
        });
        
        const user = await db.collection('Users').findOne({
          id: commit.userId
        });
        
        return {
          ...commit,
          projectName: project ? project.name : 'Unknown Project',
          projectImage: project ? project.image : '💻',
          userAvatar: user ? (user.profile?.avatar || '👤') : '👤',
          username: user ? user.username : commit.author
        };
      })
    );
    
    res.json({
      success: true,
      commits: commitsWithProjects
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user commits'
    });
  }
});

module.exports = router;

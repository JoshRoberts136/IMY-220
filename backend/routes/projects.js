const express = require('express');
const mongoose = require('mongoose');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// IMPORTANT: Put specific routes BEFORE parameterized routes

// Get user's commits - MUST be before /:id route
router.get('/user-commits/:userId', authenticateToken, async (req, res) => {
  try {
    const userId = req.params.userId;
    
    console.log('Fetching commits for user:', userId);
    
    // Get commits by user (using string ID)
    const commits = await mongoose.connection.db.collection('Commits')
      .find({ userId: userId })
      .sort({ timestamp: -1 })
      .limit(10)
      .toArray();
    
    console.log('Found commits:', commits.length);
    
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
    
    console.log('Commits with projects:', commitsWithProjects);
    
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

// Get commits for a specific project
router.get('/project-commits/:projectId', authenticateToken, async (req, res) => {
  try {
    const projectId = req.params.projectId;
    
    console.log('Fetching commits for project:', projectId);
    
    // Get commits by project (using string ID)
    const commits = await mongoose.connection.db.collection('Commits')
      .find({ projectId: projectId })
      .sort({ timestamp: -1 })
      .toArray();
    
    console.log('Found commits:', commits.length);
    
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
    console.error('Error fetching project commits:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching project commits'
    });
  }
});

// Get all projects with owner info
router.get('/', authenticateToken, async (req, res) => {
  try {
    const projects = await mongoose.connection.db.collection('Projects').find({}).toArray();
    const users = await mongoose.connection.db.collection('Users').find({}).toArray();
    
    // Add owner info to each project
    const projectsWithOwners = projects.map(project => {
      const owner = users.find(user => user.id === project.ownedBy);
      return {
        ...project,
        ownerName: owner ? owner.username : 'Unknown',
        ownerAvatar: owner ? (owner.profile?.avatar || '👤') : '👤'
      };
    });
    
    res.json({
      success: true,
      projects: projectsWithOwners
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching projects'
    });
  }
});

// Get project by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const projectId = req.params.id;
    
    // Try to find by custom id first, then by _id
    let project = await mongoose.connection.db.collection('Projects').findOne({ id: projectId });
    
    if (!project && mongoose.Types.ObjectId.isValid(projectId)) {
      project = await mongoose.connection.db.collection('Projects').findOne({
        _id: new mongoose.Types.ObjectId(projectId)
      });
    }
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }
    
    // Get owner info
    const owner = await mongoose.connection.db.collection('Users').findOne({
      id: project.ownedBy
    });
    
    res.json({
      success: true,
      id: project.id || project._id,
      name: project.name,
      description: project.description,
      status: project.status,
      language: project.language,
      ownedBy: project.ownedBy,
      members: project.members || [],
      hashtags: project.hashtags || [],
      stars: project.stars || 0,
      forks: project.forks || 0,
      commits: project.commits || [],
      messages: project.messages || [],
      lastUpdated: project.lastUpdated,
      createdAt: project.createdAt,
      ownerName: owner ? owner.username : 'Unknown',
      ownerAvatar: owner ? (owner.profile?.avatar || '👤') : '👤'
    });
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching project'
    });
  }
});

// Create new project
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, description, status, language, hashtags } = req.body;
    const user = req.user;
    const userId = user.id || user._id;
    
    const newProject = {
      id: `proj_${Date.now()}`,
      name,
      description,
      status: status || 'active',
      language,
      ownedBy: userId,
      members: [userId], // Owner is automatically a member
      hashtags: hashtags || [],
      stars: 0,
      forks: 0,
      commits: [],
      messages: [],
      lastUpdated: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };
    
    await mongoose.connection.db.collection('Projects').insertOne(newProject);
    
    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      ...newProject
    });
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating project'
    });
  }
});

// Update project
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const projectId = req.params.id;
    const updateData = req.body;
    const user = req.user;
    const userId = user.id || user._id;
    
    // Check if project exists and user owns it
    const project = await mongoose.connection.db.collection('Projects').findOne({ id: projectId });
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }
    
    if (project.ownedBy !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only update your own projects'
      });
    }
    
    // Prepare update object
    const update = {
      ...updateData,
      lastUpdated: new Date().toISOString()
    };
    
    // Remove fields that shouldn't be updated
    delete update._id;
    delete update.id;
    delete update.ownedBy;
    
    const result = await mongoose.connection.db.collection('Projects').findOneAndUpdate(
      { id: projectId },
      { $set: update },
      { returnDocument: 'after' }
    );
    
    res.json({
      success: true,
      message: 'Project updated successfully',
      ...result.value
    });
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating project'
    });
  }
});

// Delete project
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const projectId = req.params.id;
    const user = req.user;
    const userId = user.id || user._id;
    
    // Check if project exists and user owns it
    const project = await mongoose.connection.db.collection('Projects').findOne({ id: projectId });
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }
    
    if (project.ownedBy !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own projects'
      });
    }
    
    await mongoose.connection.db.collection('Projects').deleteOne({ id: projectId });
    
    res.json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting project'
    });
  }
});

module.exports = router;

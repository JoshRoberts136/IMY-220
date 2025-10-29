const express = require('express');
const mongoose = require('mongoose');
const { authenticateToken } = require('../middleware/auth');
const uploadProjectFiles = require('../config/projectFilesMulter');
const path = require('path');
const fs = require('fs');
const router = express.Router();

router.get('/user-commits/:userId', authenticateToken, async (req, res) => {
  try {
    const userId = req.params.userId;
    
    console.log('Fetching commits for user:', userId);
    
    const commits = await mongoose.connection.db.collection('Commits')
      .find({ userId: userId })
      .sort({ timestamp: -1 })
      .limit(10)
      .toArray();
    
    console.log('Found commits:', commits.length);
    
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

router.get('/project-commits/:projectId', authenticateToken, async (req, res) => {
  try {
    const projectId = req.params.projectId;
    
    console.log('Fetching commits for project:', projectId);
    
    const commits = await mongoose.connection.db.collection('Commits')
      .find({ projectId: projectId })
      .sort({ timestamp: -1 })
      .toArray();
    
    console.log('Found commits:', commits.length);
    
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

router.get('/', authenticateToken, async (req, res) => {
  try {
    const projects = await mongoose.connection.db.collection('Projects').find({}).toArray();
    const users = await mongoose.connection.db.collection('Users').find({}).toArray();
    
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

router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const projectId = req.params.id;
    
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
      checkedOutBy: project.checkedOutBy || null,
      checkedOutAt: project.checkedOutAt || null,
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
      members: [userId],
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

router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const projectId = req.params.id;
    const updateData = req.body;
    const user = req.user;
    const userId = user.id || user._id;
    
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
    
    const update = {
      ...updateData,
      lastUpdated: new Date().toISOString()
    };
    
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

router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const projectId = req.params.id;
    const user = req.user;
    const userId = user.id || user._id;
    
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

router.post('/:id/members', authenticateToken, async (req, res) => {
  try {
    const projectId = req.params.id;
    const { userId: newMemberId } = req.body;
    const user = req.user;
    const userId = user.id || user._id;
    
    console.log('Adding member to project:', { projectId, newMemberId, requesterId: userId });
    
    const project = await mongoose.connection.db.collection('Projects').findOne({ id: projectId });
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }
    
    const members = project.members || [];
    if (!members.includes(userId) && project.ownedBy !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Only project members can add other members'
      });
    }
    
    const userToAdd = await mongoose.connection.db.collection('Users').findOne({ id: newMemberId });
    if (!userToAdd) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    const friendsResponse = await mongoose.connection.db.collection('Friends').findOne({
      $or: [
        { userId: userId, friendId: newMemberId, status: 'accepted' },
        { userId: newMemberId, friendId: userId, status: 'accepted' }
      ]
    });
    
    if (!friendsResponse) {
      return res.status(403).json({
        success: false,
        message: 'You can only add friends to projects'
      });
    }
    
    if (members.includes(newMemberId)) {
      return res.status(400).json({
        success: false,
        message: 'User is already a member of this project'
      });
    }
    
    await mongoose.connection.db.collection('Projects').updateOne(
      { id: projectId },
      { 
        $push: { members: newMemberId },
        $set: { lastUpdated: new Date().toISOString() }
      }
    );
    
    console.log('Member added successfully');
    
    res.json({
      success: true,
      message: 'Member added successfully'
    });
  } catch (error) {
    console.error('Error adding member:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding member'
    });
  }
});

router.delete('/:id/members/:memberId', authenticateToken, async (req, res) => {
  try {
    const projectId = req.params.id;
    const memberIdToRemove = req.params.memberId;
    const user = req.user;
    const userId = user.id || user._id;
    
    console.log('Removing member from project:', { projectId, memberIdToRemove, requesterId: userId });
    
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
        message: 'Only the project owner can remove members'
      });
    }
    
    if (memberIdToRemove === project.ownedBy) {
      return res.status(400).json({
        success: false,
        message: 'Cannot remove the project owner'
      });
    }
    
    await mongoose.connection.db.collection('Projects').updateOne(
      { id: projectId },
      { 
        $pull: { members: memberIdToRemove },
        $set: { lastUpdated: new Date().toISOString() }
      }
    );
    
    console.log('Member removed successfully');
    
    res.json({
      success: true,
      message: 'Member removed successfully'
    });
  } catch (error) {
    console.error('Error removing member:', error);
    res.status(500).json({
      success: false,
      message: 'Error removing member'
    });
  }
});

router.post('/:id/transfer-ownership', authenticateToken, async (req, res) => {
  try {
    const projectId = req.params.id;
    const { newOwnerId } = req.body;
    const user = req.user;
    const userId = user.id || user._id;
    
    console.log('Transferring ownership:', { projectId, newOwnerId, currentOwnerId: userId });
    
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
        message: 'Only the project owner can transfer ownership'
      });
    }
    
    const members = project.members || [];
    if (!members.includes(newOwnerId)) {
      return res.status(400).json({
        success: false,
        message: 'New owner must be a member of the project'
      });
    }
    
    await mongoose.connection.db.collection('Projects').updateOne(
      { id: projectId },
      { 
        $set: { 
          ownedBy: newOwnerId,
          lastUpdated: new Date().toISOString()
        }
      }
    );
    
    res.json({
      success: true,
      message: 'Ownership transferred successfully'
    });
  } catch (error) {
    console.error('Error transferring ownership:', error);
    res.status(500).json({
      success: false,
      message: 'Error transferring ownership'
    });
  }
});

router.post('/:id/checkout', authenticateToken, async (req, res) => {
  try {
    const projectId = req.params.id;
    const user = req.user;
    const userId = user.id || user._id;
    
    const project = await mongoose.connection.db.collection('Projects').findOne({ id: projectId });
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }
    
    const members = project.members || [];
    if (!members.includes(userId)) {
      return res.status(403).json({
        success: false,
        message: 'Only project members can checkout'
      });
    }
    
    if (project.checkedOutBy) {
      return res.status(400).json({
        success: false,
        message: 'Project is already checked out by another user'
      });
    }
    
    await mongoose.connection.db.collection('Projects').updateOne(
      { id: projectId },
      { 
        $set: { 
          checkedOutBy: userId,
          checkedOutAt: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        }
      }
    );
    
    res.json({
      success: true,
      message: 'Project checked out successfully',
      checkedOutBy: userId
    });
  } catch (error) {
    console.error('Error checking out project:', error);
    res.status(500).json({
      success: false,
      message: 'Error checking out project'
    });
  }
});

router.post('/:id/checkin', authenticateToken, async (req, res) => {
  try {
    const projectId = req.params.id;
    const { message, version } = req.body;
    const user = req.user;
    const userId = user.id || user._id;
    
    const project = await mongoose.connection.db.collection('Projects').findOne({ id: projectId });
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }
    
    if (project.checkedOutBy !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only check in projects you have checked out'
      });
    }
    
    await mongoose.connection.db.collection('Projects').updateOne(
      { id: projectId },
      { 
        $unset: { 
          checkedOutBy: '',
          checkedOutAt: ''
        },
        $set: {
          version: version || project.version || '1.0.0',
          lastUpdated: new Date().toISOString()
        }
      }
    );
    
    const commit = {
      id: `commit_${Date.now()}`,
      projectId: projectId,
      userId: userId,
      author: user.username,
      message: message || 'No message provided',
      timestamp: new Date().toISOString()
    };
    
    await mongoose.connection.db.collection('Commits').insertOne(commit);
    
    res.json({
      success: true,
      message: 'Project checked in successfully',
      commit
    });
  } catch (error) {
    console.error('Error checking in project:', error);
    res.status(500).json({
      success: false,
      message: 'Error checking in project'
    });
  }
});

router.post('/:id/messages', authenticateToken, async (req, res) => {
  try {
    const projectId = req.params.id;
    const { message } = req.body;
    const user = req.user;
    const userId = user.id || user._id;
    
    const project = await mongoose.connection.db.collection('Projects').findOne({ id: projectId });
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }
    
    const members = project.members || [];
    if (!members.includes(userId)) {
      return res.status(403).json({
        success: false,
        message: 'Only project members can post messages'
      });
    }
    
    const newMessage = {
      id: `msg_${Date.now()}`,
      userId: userId,
      username: user.username,
      avatar: user.profile?.avatar || '👤',
      message: message,
      timestamp: new Date().toISOString()
    };
    
    await mongoose.connection.db.collection('Projects').updateOne(
      { id: projectId },
      { 
        $push: { messages: newMessage },
        $set: { lastUpdated: new Date().toISOString() }
      }
    );
    
    res.json({
      success: true,
      message: 'Message posted successfully',
      messageData: newMessage
    });
  } catch (error) {
    console.error('Error posting message:', error);
    res.status(500).json({
      success: false,
      message: 'Error posting message'
    });
  }
});

router.get('/:id/messages', authenticateToken, async (req, res) => {
  try {
    const projectId = req.params.id;
    
    const project = await mongoose.connection.db.collection('Projects').findOne({ id: projectId });
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }
    
    res.json({
      success: true,
      messages: project.messages || []
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching messages'
    });
  }
});

router.post('/:id/files', authenticateToken, uploadProjectFiles.array('files', 10), async (req, res) => {
  try {
    const projectId = req.params.id;
    const user = req.user;
    const userId = user.id || user._id;
    
    const project = await mongoose.connection.db.collection('Projects').findOne({ id: projectId });
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }
    
    const members = project.members || [];
    if (!members.includes(userId)) {
      return res.status(403).json({
        success: false,
        message: 'Only project members can upload files'
      });
    }
    
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded'
      });
    }
    
    const uploadedFiles = req.files.map(file => ({
      id: `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      originalName: file.originalname,
      filename: file.filename,
      path: `/uploads/project-files/${projectId}/${file.filename}`,
      size: file.size,
      mimetype: file.mimetype,
      uploadedBy: userId,
      uploadedAt: new Date().toISOString()
    }));
    
    await mongoose.connection.db.collection('Projects').updateOne(
      { id: projectId },
      { 
        $push: { files: { $each: uploadedFiles } },
        $set: { lastUpdated: new Date().toISOString() }
      }
    );
    
    res.json({
      success: true,
      message: 'Files uploaded successfully',
      files: uploadedFiles
    });
  } catch (error) {
    console.error('Error uploading files:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading files'
    });
  }
});

router.get('/:id/files', authenticateToken, async (req, res) => {
  try {
    const projectId = req.params.id;
    
    const project = await mongoose.connection.db.collection('Projects').findOne({ id: projectId });
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }
    
    res.json({
      success: true,
      files: project.files || []
    });
  } catch (error) {
    console.error('Error fetching files:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching files'
    });
  }
});

router.get('/:id/files/:fileId/download', authenticateToken, async (req, res) => {
  try {
    const projectId = req.params.id;
    const fileId = req.params.fileId;
    
    const project = await mongoose.connection.db.collection('Projects').findOne({ id: projectId });
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }
    
    const files = project.files || [];
    const file = files.find(f => f.id === fileId);
    
    if (!file) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }
    
    const filePath = path.join(__dirname, '../uploads/project-files', projectId, file.filename);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'File not found on server'
      });
    }
    
    res.download(filePath, file.originalName);
  } catch (error) {
    console.error('Error downloading file:', error);
    res.status(500).json({
      success: false,
      message: 'Error downloading file'
    });
  }
});

module.exports = router;

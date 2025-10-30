const express = require('express');
const mongoose = require('mongoose');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

router.get('/', authenticateToken, async (req, res) => {
  try {
    const { query, type, limit = 10, skip = 0 } = req.query;
    
    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }
    
    const searchLimit = Math.min(parseInt(limit), 50); 
    const searchSkip = parseInt(skip) || 0;
    
    let results = [];
    
    if (!type || type === 'user') {
      const userResults = await mongoose.connection.db.collection('Users').find({
        $or: [
          { username: { $regex: query, $options: 'i' } },
          { email: { $regex: query, $options: 'i' } },
          { 'profile.firstName': { $regex: query, $options: 'i' } },
          { 'profile.lastName': { $regex: query, $options: 'i' } },
          { 'profile.bio': { $regex: query, $options: 'i' } }
        ],
        isActive: true
      })
      .skip(searchSkip)
      .limit(searchLimit)
      .toArray();
      
      const users = userResults.map(user => {
        const { password, ...userWithoutPassword } = user;
        return {
          type: 'user',
          id: user._id,
          username: user.username,
          profile: user.profile,
          ...userWithoutPassword
        };
      });
      
      if (type === 'user') {
        return res.json({
          success: true,
          users: users,
          results: users,
          total: users.length,
          query,
          type: 'user'
        });
      }
      
      results = results.concat(users);
    }
    
    if (!type || type === 'project') {
      const projectResults = await mongoose.connection.db.collection('Projects').find({
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } },
          { language: { $regex: query, $options: 'i' } },
          { hashtags: { $in: [new RegExp(query, 'i')] } }
        ]
      })
      .skip(searchSkip)
      .limit(searchLimit)
      .toArray();
      
      const projects = await Promise.all(projectResults.map(async (project) => {
        const owner = await mongoose.connection.db.collection('Users').findOne({
          _id: new mongoose.Types.ObjectId(project.ownedBy)
        });
        
        return {
          type: 'project',
          ...project,
          ownerName: owner ? owner.username : 'Unknown',
          ownerAvatar: owner ? (owner.profile?.avatar || '👤') : '👤'
        };
      }));
      
      if (type === 'project') {
        return res.json({
          success: true,
          results: projects,
          total: projects.length
        });
      }
      
      results = results.concat(projects);
    }
    
    results = results.sort((a, b) => {
      const aExactMatch = a.username?.toLowerCase() === query.toLowerCase() ||
                         a.name?.toLowerCase() === query.toLowerCase();
      const bExactMatch = b.username?.toLowerCase() === query.toLowerCase() ||
                         b.name?.toLowerCase() === query.toLowerCase();
      
      if (aExactMatch && !bExactMatch) return -1;
      if (!aExactMatch && bExactMatch) return 1;
      
      if (a.type === 'user' && b.type === 'project') return -1;
      if (a.type === 'project' && b.type === 'user') return 1;
      
      return 0;
    });
    
    res.json({
      success: true,
      results: results.slice(0, searchLimit),
      total: results.length,
      query,
      type: type || 'all'
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error performing search'
    });
  }
});

router.get('/suggestions', authenticateToken, async (req, res) => {
  try {
    const { query, limit = 5 } = req.query;
    
    if (!query || query.length < 2) {
      return res.json({
        success: true,
        suggestions: []
      });
    }
    
    const searchLimit = Math.min(parseInt(limit), 10);

    const userSuggestions = await mongoose.connection.db.collection('Users').find({
      username: { $regex: `^${query}`, $options: 'i' },
      isActive: true
    })
    .limit(searchLimit)
    .toArray();
    
    const projectSuggestions = await mongoose.connection.db.collection('Projects').find({
      name: { $regex: `^${query}`, $options: 'i' }
    })
    .limit(searchLimit)
    .toArray();
    
    const suggestions = [
      ...userSuggestions.map(user => ({
        type: 'user',
        id: user._id,
        text: user.username,
        avatar: user.profile?.avatar
      })),
      ...projectSuggestions.map(project => ({
        type: 'project',
        id: project._id,
        text: project.name,
        language: project.language
      }))
    ].slice(0, searchLimit);
    
    res.json({
      success: true,
      suggestions
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error getting search suggestions'
    });
  }
});

module.exports = router;

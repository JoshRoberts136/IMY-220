const express = require('express');
const router = express.Router();
const { User, Post } = require('../models');
const { authenticateToken, optionalAuth } = require('../middleware/auth');

// ==================== USER ROUTES ====================

// Get all users (public, limited info)
router.get('/users', async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    
    const users = await User.find({ isActive: true })
      .select('username profile.firstName profile.lastName profile.avatar createdAt')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await User.countDocuments({ isActive: true });
    
    res.json({
      success: true,
      count: users.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: users
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error',
      message: error.message
    });
  }
});

// Get single user by ID (public, limited info)
router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('username profile createdAt lastLogin');
    
    if (!user || !user.isActive) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    // Get user's post count
    const postCount = await Post.countDocuments({ 
      author: user._id, 
      status: 'published' 
    });
    
    res.json({
      success: true,
      data: {
        ...user.toJSON(),
        postCount
      }
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error',
      message: error.message
    });
  }
});

// ==================== POST ROUTES ====================

// Get all posts (public, with optional auth for user-specific data)
router.get('/posts', optionalAuth, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      status = 'published',
      author,
      category,
      tags,
      search
    } = req.query;
    
    // Build query
    let query = { status };
    
    if (author) {
      query.author = author;
    }
    
    if (category) {
      query.category = category;
    }
    
    if (tags) {
      const tagsArray = Array.isArray(tags) ? tags : [tags];
      query.tags = { $in: tagsArray };
    }
    
    if (search) {
      query.$text = { $search: search };
    }
    
    const posts = await Post.find(query)
      .populate('author', 'username profile.firstName profile.lastName profile.avatar')
      .populate('comments.user', 'username profile.firstName profile.lastName')
      .sort(search ? { score: { $meta: 'textScore' } } : { createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Post.countDocuments(query);
    
    // If user is authenticated, mark posts they've liked
    if (req.user) {
      posts.forEach(post => {
        post.isLikedByUser = post.likes.some(like => 
          like.user.toString() === req.user._id.toString()
        );
      });
    }
    
    res.json({
      success: true,
      count: posts.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: posts
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error',
      message: error.message
    });
  }
});

// Get single post by ID
router.get('/posts/:id', optionalAuth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'username profile.firstName profile.lastName profile.avatar')
      .populate('comments.user', 'username profile.firstName profile.lastName profile.avatar');
    
    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Post not found'
      });
    }
    
    // Increment view count
    post.viewCount += 1;
    await post.save();
    
    // If user is authenticated, mark if they've liked this post
    if (req.user) {
      post.isLikedByUser = post.likes.some(like => 
        like.user.toString() === req.user._id.toString()
      );
    }
    
    res.json({
      success: true,
      data: post
    });
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error',
      message: error.message
    });
  }
});

// Create a new post (requires authentication)
router.post('/posts', authenticateToken, async (req, res) => {
  try {
    const { title, content, tags, category, status } = req.body;
    
    const post = new Post({
      title,
      content,
      author: req.user._id,
      tags: tags || [],
      category: category || 'general',
      status: status || 'draft'
    });
    
    await post.save();
    
    // Populate author information
    await post.populate('author', 'username profile.firstName profile.lastName profile.avatar');
    
    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: post
    });
  } catch (error) {
    console.error('Error creating post:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: error.message
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server Error',
      message: error.message
    });
  }
});

// Update a post (requires authentication and ownership)
router.put('/posts/:id', authenticateToken, async (req, res) => {
  try {
    const { title, content, tags, category, status } = req.body;
    
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Post not found'
      });
    }
    
    // Check if user owns this post
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Access denied',
        message: 'You can only edit your own posts'
      });
    }
    
    // Update fields
    if (title !== undefined) post.title = title;
    if (content !== undefined) post.content = content;
    if (tags !== undefined) post.tags = tags;
    if (category !== undefined) post.category = category;
    if (status !== undefined) post.status = status;
    
    await post.save();
    await post.populate('author', 'username profile.firstName profile.lastName profile.avatar');
    
    res.json({
      success: true,
      message: 'Post updated successfully',
      data: post
    });
  } catch (error) {
    console.error('Error updating post:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: error.message
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server Error',
      message: error.message
    });
  }
});

// Delete a post (requires authentication and ownership)
router.delete('/posts/:id', authenticateToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Post not found'
      });
    }
    
    // Check if user owns this post
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Access denied',
        message: 'You can only delete your own posts'
      });
    }
    
    await Post.findByIdAndDelete(req.params.id);
    
    res.json({
      success: true,
      message: 'Post deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error',
      message: error.message
    });
  }
});

// ==================== POST INTERACTION ROUTES ====================

// Like/Unlike a post
router.post('/posts/:id/like', authenticateToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Post not found'
      });
    }
    
    const userId = req.user._id;
    const existingLikeIndex = post.likes.findIndex(like => 
      like.user.toString() === userId.toString()
    );
    
    let message;
    if (existingLikeIndex > -1) {
      // Unlike the post
      post.likes.splice(existingLikeIndex, 1);
      message = 'Post unliked successfully';
    } else {
      // Like the post
      post.likes.push({
        user: userId,
        createdAt: new Date()
      });
      message = 'Post liked successfully';
    }
    
    await post.save();
    
    res.json({
      success: true,
      message,
      data: {
        likeCount: post.likes.length,
        isLikedByUser: existingLikeIndex === -1
      }
    });
  } catch (error) {
    console.error('Error toggling like:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error',
      message: error.message
    });
  }
});

// Add a comment to a post
router.post('/posts/:id/comments', authenticateToken, async (req, res) => {
  try {
    const { content } = req.body;
    
    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: 'Comment content is required'
      });
    }
    
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Post not found'
      });
    }
    
    const newComment = {
      user: req.user._id,
      content: content.trim(),
      createdAt: new Date()
    };
    
    post.comments.push(newComment);
    await post.save();
    
    // Populate the new comment's user info
    await post.populate('comments.user', 'username profile.firstName profile.lastName profile.avatar');
    
    // Get the newly added comment
    const addedComment = post.comments[post.comments.length - 1];
    
    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      data: {
        comment: addedComment,
        commentCount: post.comments.length
      }
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: error.message
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server Error',
      message: error.message
    });
  }
});

// Delete a comment (requires authentication and ownership)
router.delete('/posts/:postId/comments/:commentId', authenticateToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Post not found'
      });
    }
    
    const comment = post.comments.id(req.params.commentId);
    
    if (!comment) {
      return res.status(404).json({
        success: false,
        error: 'Comment not found'
      });
    }
    
    // Check if user owns this comment
    if (comment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Access denied',
        message: 'You can only delete your own comments'
      });
    }
    
    post.comments.pull(req.params.commentId);
    await post.save();
    
    res.json({
      success: true,
      message: 'Comment deleted successfully',
      data: {
        commentCount: post.comments.length
      }
    });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error',
      message: error.message
    });
  }
});

// ==================== STATISTICS ROUTES ====================

// Database stats endpoint
router.get('/stats', async (req, res) => {
  try {
    const userCount = await User.countDocuments({ isActive: true });
    const postCount = await Post.countDocuments({ status: 'published' });
    const totalPosts = await Post.countDocuments();
    const totalComments = await Post.aggregate([
      { $group: { _id: null, totalComments: { $sum: { $size: "$comments" } } } }
    ]);
    const totalLikes = await Post.aggregate([
      { $group: { _id: null, totalLikes: { $sum: { $size: "$likes" } } } }
    ]);
    
    res.json({
      success: true,
      data: {
        users: {
          active: userCount
        },
        posts: {
          published: postCount,
          total: totalPosts,
          drafts: totalPosts - postCount
        },
        engagement: {
          totalComments: totalComments[0]?.totalComments || 0,
          totalLikes: totalLikes[0]?.totalLikes || 0
        }
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error',
      message: error.message
    });
  }
});

// Get trending posts (most liked in the last week)
router.get('/posts/trending', async (req, res) => {
  try {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const trendingPosts = await Post.find({
      status: 'published',
      createdAt: { $gte: oneWeekAgo }
    })
    .populate('author', 'username profile.firstName profile.lastName profile.avatar')
    .sort({ likeCount: -1, viewCount: -1 })
    .limit(10);
    
    res.json({
      success: true,
      count: trendingPosts.length,
      data: trendingPosts
    });
  } catch (error) {
    console.error('Error fetching trending posts:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error',
      message: error.message
    });
  }
});

// Get categories (unique categories from posts)
router.get('/categories', async (req, res) => {
  try {
    const categories = await Post.distinct('category', { status: 'published' });
    
    res.json({
      success: true,
      data: categories.sort()
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error',
      message: error.message
    });
  }
});

// Get popular tags
router.get('/tags', async (req, res) => {
  try {
    const tags = await Post.aggregate([
      { $match: { status: 'published' } },
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 20 }
    ]);
    
    res.json({
      success: true,
      data: tags.map(tag => ({
        name: tag._id,
        count: tag.count
      }))
    });
  } catch (error) {
    console.error('Error fetching tags:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error',
      message: error.message
    });
  }
});

// ==================== MESSAGES ROUTES ====================

// Get all messages (team communications)
router.get('/messages', async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    
    // For now, return hardcoded messages data
    // In a real app, this would query a Messages collection
    const messages = [
      {
        id: 1,
        user: 'WraithRunner',
        message: 'Fixed hitbox detection bugs',
        timestamp: '2 hours ago',
        userId: 'user_001',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 2,
        user: 'PathfinderBot',
        message: 'Working on trajectory calculations',
        timestamp: '6 hours ago',
        userId: 'user_002',
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 3,
        user: 'CodeLegend42',
        message: 'Optimized rendering pipeline',
        timestamp: '1 day ago',
        userId: 'user_003',
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      }
    ];
    
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedMessages = messages.slice(startIndex, endIndex);
    
    res.json({
      success: true,
      count: paginatedMessages.length,
      total: messages.length,
      page: parseInt(page),
      pages: Math.ceil(messages.length / limit),
      data: paginatedMessages
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error',
      message: error.message
    });
  }
});

// ==================== FILES ROUTES ====================

// Get all files
router.get('/files', async (req, res) => {
  try {
    const { projectId, status } = req.query;
    
    let files = [
      {
        id: 1,
        name: 'engine/core.cpp',
        status: 'checked-in',
        lastModified: '2 hours ago',
        size: '45.2 KB',
        author: 'WraithRunner',
        projectId: 'project_001'
      },
      {
        id: 2,
        name: 'hitbox/detection.js',
        status: 'checked-out',
        lastModified: '4 hours ago',
        size: '12.8 KB',
        author: 'PathfinderBot',
        projectId: 'project_001'
      },
      {
        id: 3,
        name: 'networking/server.py',
        status: 'available',
        lastModified: '1 day ago',
        size: '28.5 KB',
        author: 'CodeLegend42',
        projectId: 'project_002'
      },
      {
        id: 4,
        name: 'ui/components.tsx',
        status: 'checked-in',
        lastModified: '3 hours ago',
        size: '18.9 KB',
        author: 'ReactMaster',
        projectId: 'project_003'
      }
    ];
    
    // Filter by projectId if provided
    if (projectId) {
      files = files.filter(file => file.projectId === projectId);
    }
    
    // Filter by status if provided
    if (status) {
      files = files.filter(file => file.status === status);
    }
    
    res.json({
      success: true,
      count: files.length,
      data: files
    });
  } catch (error) {
    console.error('Error fetching files:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error',
      message: error.message
    });
  }
});

// ==================== LANGUAGES ROUTES ====================

// Get programming languages/skills
router.get('/languages', async (req, res) => {
  try {
    const { userId } = req.query;
    
    const languages = [
      { id: 1, name: 'Java', level: 'expert', yearsExperience: 5, projectsCount: 25 },
      { id: 2, name: 'C++', level: 'expert', yearsExperience: 4, projectsCount: 18 },
      { id: 3, name: 'Python', level: 'advanced', yearsExperience: 3, projectsCount: 22 },
      { id: 4, name: 'JavaScript', level: 'advanced', yearsExperience: 4, projectsCount: 30 },
      { id: 5, name: 'Rust', level: 'intermediate', yearsExperience: 1, projectsCount: 8 },
      { id: 6, name: 'Go', level: 'intermediate', yearsExperience: 2, projectsCount: 12 },
      { id: 7, name: 'TypeScript', level: 'advanced', yearsExperience: 3, projectsCount: 20 }
    ];
    
    res.json({
      success: true,
      count: languages.length,
      data: languages
    });
  } catch (error) {
    console.error('Error fetching languages:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error',
      message: error.message
    });
  }
});

// ==================== COMMITS ROUTES ====================

// Get commits
router.get('/commits', async (req, res) => {
  try {
    const { projectId, page = 1, limit = 20 } = req.query;
    
    let commits = [
      {
        id: 1,
        hash: 'a1b2c3d',
        message: 'Fix memory leak in rendering system',
        author: 'WraithRunner',
        timestamp: '2 hours ago',
        filesChanged: 3,
        projectId: 'project_001',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 2,
        hash: 'e4f5g6h',
        message: 'Add neural network optimization',
        author: 'PathfinderBot',
        timestamp: '5 hours ago',
        filesChanged: 7,
        projectId: 'project_002',
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 3,
        hash: 'i7j8k9l',
        message: 'Update component documentation',
        author: 'CodeLegend42',
        timestamp: '1 day ago',
        filesChanged: 12,
        projectId: 'project_003',
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      }
    ];
    
    // Filter by projectId if provided
    if (projectId) {
      commits = commits.filter(commit => commit.projectId === projectId);
    }
    
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedCommits = commits.slice(startIndex, endIndex);
    
    res.json({
      success: true,
      count: paginatedCommits.length,
      total: commits.length,
      page: parseInt(page),
      pages: Math.ceil(commits.length / limit),
      data: paginatedCommits
    });
  } catch (error) {
    console.error('Error fetching commits:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error',
      message: error.message
    });
  }
});

module.exports = router;

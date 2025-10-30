const express = require('express');
const { getDB } = require('../config/database');
const { ObjectId } = require('mongodb');
const { authenticateToken } = require('../middleware/auth');
const adminRoutes = require('./admin');
const router = express.Router();

router.get('/test', (req, res) => {
  res.json({ message: 'API test successful!' });
});

router.get('/users', authenticateToken, async (req, res) => {
  try {
    const db = getDB();
    const users = await db.collection('Users').find({}).limit(10).toArray();

    const usersWithoutPasswords = users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });

    res.json(usersWithoutPasswords);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching users'
    });
  }
});



router.use('/admin', adminRoutes);

module.exports = router;

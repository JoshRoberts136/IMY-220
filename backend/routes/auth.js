const express = require('express');
const router = express.Router();

const mockUsers = [
  {
    id: 1,
    legendName: 'Test Champion',
    legendId: 'test@example.com',
    passcode: 'password123',
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    legendName: 'Demo Legend',
    legendId: 'demo@example.com',
    passcode: 'demo123',
    createdAt: new Date().toISOString()
  }
];

const generateMockToken = (user) => {
  return `mock-jwt-token-${user.id}-${Date.now()}`;
};

const findUserByLegendId = (legendId) => {
  return mockUsers.find(user => user.legendId === legendId);
};

router.post('/signup', (req, res) => {
  try {
    const { legendName, legendId, passcode } = req.body;

    if (!legendName || !legendId || !passcode) {
      return res.status(400).json({
        success: false,
        error: 'All fields are required',
        message: 'Please provide legendName, legendId, and passcode'
      });
    }

    if (findUserByLegendId(legendId)) {
      return res.status(409).json({
        success: false,
        error: 'User already exists',
        message: 'A champion with this Legend ID already exists'
      });
    }

    const newUser = {
      id: mockUsers.length + 1,
      legendName,
      legendId,
      passcode,
      createdAt: new Date().toISOString()
    };

    mockUsers.push(newUser);

    const token = generateMockToken(newUser);

    const userResponse = {
      id: newUser.id,
      legendName: newUser.legendName,
      legendId: newUser.legendId,
      createdAt: newUser.createdAt
    };

    res.status(201).json({
      success: true,
      message: 'Champion registration successful!',
      user: userResponse,
      token: token
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to register champion'
    });
  }
});

router.post('/login', (req, res) => {
  try {
    const { legendId, passcode } = req.body;

    if (!legendId || !passcode) {
      return res.status(400).json({
        success: false,
        error: 'Missing credentials',
        message: 'Please provide both Legend ID and passcode'
      });
    }

    const user = findUserByLegendId(legendId);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials',
        message: 'Legend ID not found'
      });
    }

    if (user.passcode !== passcode) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials',
        message: 'Incorrect passcode'
      });
    }

    const token = generateMockToken(user);

    const userResponse = {
      id: user.id,
      legendName: user.legendName,
      legendId: user.legendId,
      createdAt: user.createdAt
    };

    res.status(200).json({
      success: true,
      message: 'Welcome back, Champion!',
      user: userResponse,
      token: token
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to authenticate'
    });
  }
});

router.post('/logout', (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to logout'
    });
  }
});

router.get('/verify', (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        error: 'No token provided',
        message: 'Authorization header is missing'
      });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Invalid token format',
        message: 'Token should be in format: Bearer <token>'
      });
    }

    if (!token.startsWith('mock-jwt-token-')) {
      return res.status(401).json({
        success: false,
        error: 'Invalid token',
        message: 'Token verification failed'
      });
    }

    const parts = token.split('-');
    const userId = parseInt(parts[3]);
    const user = mockUsers.find(u => u.id === userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'User not found',
        message: 'Token is valid but user does not exist'
      });
    }

    const userResponse = {
      id: user.id,
      legendName: user.legendName,
      legendId: user.legendId,
      createdAt: user.createdAt
    };

    res.status(200).json({
      success: true,
      message: 'Token verified',
      user: userResponse
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to verify token'
    });
  }
});

module.exports = router;
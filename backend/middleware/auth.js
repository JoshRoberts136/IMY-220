
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Access denied',
      message: 'No token provided'
    });
  }


  if (!token.startsWith('mock-jwt-token-')) {
    return res.status(403).json({
      success: false,
      error: 'Access denied',
      message: 'Invalid token'
    });
  }


  try {
    const parts = token.split('-');
    const userId = parseInt(parts[3]);
    req.userId = userId;
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      error: 'Access denied',
      message: 'Token verification failed'
    });
  }
};

module.exports = {
  authenticateToken
};
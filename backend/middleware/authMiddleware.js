const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/config');
const User = require('../models/User');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  jwt.verify(token, JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token.' });
    }
    
    try {
      const user = await User.findById(decoded.id).populate('role');
      if (!user) {
        return res.status(404).json({ error: 'User no longer exists.' });
      }
      
      if (!user.isActive) {
        return res.status(403).json({ error: 'User account is inactive.' });
      }

      req.user = user;
      next();
    } catch (dbErr) {
      return res.status(500).json({ error: 'Internal server error during authentication.' });
    }
  });
};

module.exports = { authenticateToken };

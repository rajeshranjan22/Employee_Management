const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../config/config');
const User = require('../models/User');
const Role = require('../models/Role');

// POST /api/auth/register
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email and password are required.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists.' });
    }

    // Assign default 'Employee' role
    let defaultRole = await Role.findOne({ name: 'Employee' });
    if (!defaultRole) {
      // Fallback if DB not seeded
      defaultRole = await Role.create({ name: 'Employee', permissions: [], description: 'Default employee role', isCustom: false });
    }

    const newUser = await User.create({ name, email, password, role: defaultRole._id });
    const populatedUser = await User.findById(newUser._id).populate('role');

    res.status(201).json({ 
      message: 'User registered successfully!',
      user: { id: populatedUser._id, name: populatedUser.name, email: populatedUser.email, role: populatedUser.role, department: populatedUser.department }
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = await User.findOne({ email }).select('+password').populate('role');
    
    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ error: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email }, // Just put ID and email in token, fetch role dynamically
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role, department: user.department } });
  } catch (err) {
    next(err);
  }
};

// GET /api/auth/me  (protected)
const getMe = (req, res) => {
  res.json({ user: { id: req.user._id, name: req.user.name, email: req.user.email, role: req.user.role, department: req.user.department } });
};

module.exports = { register, login, getMe };

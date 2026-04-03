const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const mongoose = require('mongoose');

// Simple Memory Cache for user metadata
const userCache = new Map();

// Helper to generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret_key', {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      console.warn('Signup Error: Missing fields');
      return res.status(400).json({ success: false, message: 'Please provide all fields' });
    }

    if (mongoose.connection.readyState !== 1) {
      console.warn('DB Disconnected: using Mock Registration');
      const mockId = new mongoose.Types.ObjectId().toString();
      const payload = { id: mockId, name, email };
      userCache.set(mockId, payload);
      return res.status(201).json({ success: true, token: generateToken(mockId), user: payload });
    }

    let user = await User.findOne({ email });
    if (user) {
      console.warn('Signup Error: User already exists', email);
      return res.status(400).json({ success: false, message: 'Email already exists' });
    }

    user = await User.create({ name, email, password });

    const token = generateToken(user._id);
    const payload = { id: user._id, name: user.name, email: user.email };
    userCache.set(user._id.toString(), payload);
    
    res.status(201).json({ success: true, token, user: payload });
  } catch (error) {
    console.error('Signup Error:', error);
    
    // Map native MongoDB Validation rules to usable frontend strings
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    
    // Catch high-concurrency race condition duplicates
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: 'Email already exists' });
    }

    res.status(500).json({ success: false, message: 'Server error during registration' });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      console.warn('Login Error: Missing email or password');
      return res.status(400).json({ success: false, message: 'Please provide an email and password' });
    }

    if (mongoose.connection.readyState !== 1) {
      console.warn('DB Disconnected: using Mock Login');
      const mockId = new mongoose.Types.ObjectId().toString();
      const payload = { id: mockId, name: 'Demo User', email };
      userCache.set(mockId, payload);
      return res.status(200).json({ success: true, token: generateToken(mockId), user: payload });
    }

    const user = await User.findOne({ email }).select('+password -createdAt -__v').lean();
    if (!user) {
      console.warn('Login Error: User not found for email', email);
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.warn('Login Error: Password mismatch for user', email);
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);
    const payload = { id: user._id, name: user.name, email: user.email };
    userCache.set(user._id.toString(), payload);

    res.status(200).json({ success: true, token, user: payload });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const userId = req.user.id.toString();
    if (userCache.has(userId)) {
      return res.status(200).json({ success: true, user: userCache.get(userId) });
    }

    if (mongoose.connection.readyState !== 1) {
      console.warn('DB Disconnected: Mocking getMe logic');
      const payload = { id: userId, name: 'Demo User', email: 'demo@example.com' };
      userCache.set(userId, payload);
      return res.status(200).json({ success: true, user: payload });
    }

    const user = await User.findById(userId).select('name email').lean();
    if (!user) {
      console.warn('Auth Check Error: User missing for ID', userId);
      return res.status(404).json({ success: false, message: 'User missing' });
    }
    
    const payload = { id: user._id, name: user.name, email: user.email };
    userCache.set(userId, payload);

    res.status(200).json({ success: true, user: payload });
  } catch (error) {
    console.error('Auth Check Error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch user data' });
  }
};

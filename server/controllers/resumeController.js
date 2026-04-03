const Resume = require('../models/Resume');
const mongoose = require('mongoose');

// Mock memory for resume state when DB is dead
const mockResumes = new Map();

// @desc    Get current user's resume
// @route   GET /api/resume
// @access  Private
exports.getResume = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
       console.warn('DB Disconnected: Serving dummy / cached mock resume');
       const mockData = mockResumes.get(req.user.id.toString());
       if (mockData) return res.status(200).json({ success: true, resume: mockData });
       return res.status(200).json({ success: true, isNew: true, resume: null });
    }

    const resume = await Resume.findOne({ user: req.user.id }).lean();
    
    if (!resume) {
      return res.status(200).json({ success: true, isNew: true, resume: null });
    }

    res.status(200).json({ success: true, resume });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') console.error('Resume Fetch Error:', error);
    res.status(500).json({ error: 'Server error parsing resume data' });
  }
};

// @desc    Update or create current user's resume
// @route   PUT /api/resume
// @access  Private
exports.saveResume = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
       console.warn('DB Disconnected: Saving mock resume to memory');
       const payload = { ...req.body, user: req.user.id };
       mockResumes.set(req.user.id.toString(), payload);
       return res.status(200).json({ success: true, resume: payload });
    }

    let resume = await Resume.findOne({ user: req.user.id }).lean();

    if (resume) {
      // Update existing resume
      resume = await Resume.findOneAndUpdate(
        { user: req.user.id },
        { $set: req.body },
        { new: true, runValidators: true, lean: true }
      );
      return res.status(200).json({ success: true, resume });
    } else {
      // Create new resume explicitly attached to user
      resume = await Resume.create({
        ...req.body,
        user: req.user.id
      });
      return res.status(201).json({ success: true, resume });
    }
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') console.error('Resume Save Error:', error);
    res.status(500).json({ error: 'Server error saving resume data' });
  }
};

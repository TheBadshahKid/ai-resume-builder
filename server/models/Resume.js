const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  personalInfo: {
    fullName: { type: String, default: '' },
    jobTitle: { type: String, default: '' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    location: { type: String, default: '' },
    summary: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    github: { type: String, default: '' },
  },
  experience: { type: Array, default: [] },
  education: { type: Array, default: [] },
  skills: { type: Array, default: [] },
  projects: { type: Array, default: [] },
  theme: {
    template: { type: String, default: 'modern' },
    primaryColor: { type: String, default: '#2563eb' },
    secondaryColor: { type: String, default: '#1f2937' },
    fontFamily: { type: String, default: 'Inter, sans-serif' },
    fontSize: { type: String, default: '14px' },
    layout: { type: String, default: 'single' },
    spacing: { type: String, default: 'normal' },
  },
  sectionOrder: {
    type: Array,
    default: ['experience', 'education', 'skills', 'projects']
  },
  sectionVisibility: {
    experience: { type: Boolean, default: true },
    education: { type: Boolean, default: true },
    skills: { type: Boolean, default: true },
    projects: { type: Boolean, default: true }
  }
}, { timestamps: true });

module.exports = mongoose.model('Resume', resumeSchema);

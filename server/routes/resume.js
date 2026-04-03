const express = require('express');
const router = express.Router();
const { getResume, saveResume } = require('../controllers/resumeController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getResume);
router.put('/', protect, saveResume);

module.exports = router;

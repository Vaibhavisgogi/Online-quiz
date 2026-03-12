const express = require('express');
const { protect, admin } = require('../middleware/authMiddleware');
const Announcement = require('../models/Announcement');
const router = express.Router();

// @route   POST /api/announcements
// @desc    Create a new announcement
// @access  Admin Only
router.post('/', protect, admin, async (req, res) => {
  try {
    const { title, content, targetTopic, expiresAt } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({ msg: 'Title and content are required' });
    }

    const announcement = await Announcement.create({
      title,
      content,
      targetTopic: targetTopic || 'all',
      expiresAt: expiresAt || null,
      createdBy: req.user._id
    });

    res.status(201).json({ msg: 'Announcement created successfully', announcement });
  } catch (error) {
    res.status(500).json({ msg: 'Error creating announcement', error: error.message });
  }
});

// @route   GET /api/announcements
// @desc    Get all active announcements
// @access  Protected
router.get('/', protect, async (req, res) => {
  try {
    // Current date for expiry check
    const now = new Date();
    
    const announcements = await Announcement.find({
      $or: [
        { expiresAt: { $exists: false } },
        { expiresAt: null },
        { expiresAt: { $gt: now } }
      ]
    }).sort({ createdAt: -1 });

    res.json(announcements);
  } catch (error) {
    res.status(500).json({ msg: 'Error fetching announcements', error: error.message });
  }
});

// @route   DELETE /api/announcements/:id
// @desc    Delete an announcement
// @access  Admin Only
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    await Announcement.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Announcement deleted successfully' });
  } catch (error) {
    res.status(500).json({ msg: 'Error deleting announcement', error: error.message });
  }
});

module.exports = router;

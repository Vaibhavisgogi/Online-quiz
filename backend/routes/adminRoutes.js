const express = require('express');
const { protect, admin } = require('../middleware/authMiddleware');
const User = require('../models/User');
const Quiz = require('../models/Quiz');
const Result = require('../models/Result');
const router = express.Router();

router.get('/stats', protect, admin, async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const quizCount = await Quiz.countDocuments();
    res.json({
      totalUsers: userCount,
      totalQuizzes: quizCount
    });
  } catch (error) {
    res.status(500).json({ msg: 'Error fetching stats', error: error.message });
  }
});

router.get('/users', protect, admin, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ msg: 'Error fetching users', error: error.message });
  }
});

router.delete('/users/:id', protect, admin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ msg: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ msg: 'Error deleting user', error: error.message });
  }
});

router.get('/user-report/:id', protect, admin, async (req, res) => {
  try {
    const results = await Result.find({ user: req.params.id })
      .populate('quiz', 'title topic subject')
      .sort({ date: -1 });
    
    const user = await User.findById(req.params.id).select('-password');
    
    res.json({
      user,
      results
    });
  } catch (error) {
    res.status(500).json({ msg: 'Error fetching user report', error: error.message });
  }
});

module.exports = router;

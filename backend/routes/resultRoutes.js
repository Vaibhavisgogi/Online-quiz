const express = require('express');
const { getUserResults, getLeaderboard, getResultById } = require('../controllers/resultController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/my-results', protect, getUserResults);
router.get('/leaderboard', getLeaderboard);
router.get('/:id', protect, getResultById);

module.exports = router;
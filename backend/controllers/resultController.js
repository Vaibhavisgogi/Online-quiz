const Result = require('../models/Result');

exports.getUserResults = async (req, res) => {
  try {
    const results = await Result.find({ user: req.user._id })
      .populate('quiz', 'title subject')
      .populate('user', 'name email')
      .sort({ date: -1 });

    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching results', error: err.message });
  }
};

// ✅ FIX: Public leaderboard - no authentication required
exports.getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await Result.find()
      .populate('user', 'name')
      .populate('quiz', 'title')
      .sort({ score: -1, percentage: -1 })
      .limit(50);

    res.status(200).json(leaderboard);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching leaderboard', error: err.message });
  }
};

exports.getResultById = async (req, res) => {
  try {
    const result = await Result.findById(req.params.id)
      .populate('quiz')
      .populate('user', 'name email');
    
    if (!result) {
      return res.status(404).json({ msg: 'Result not found' });
    }

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching result detail', error: err.message });
  }
};
const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
  score: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  percentage: { type: Number },
  userAnswers: [
    {
      questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz.questions' },
      selectedOption: { type: String }
    }
  ],
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Result', resultSchema);
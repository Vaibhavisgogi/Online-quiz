const express = require('express');
const { createQuiz, getQuizzes, getQuizById, takeQuiz, updateQuiz, deleteQuiz, autoGenerateQuiz } = require('../controllers/quizController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/auto-generate', protect, autoGenerateQuiz); // Auto generate quiz questions
router.post('/', protect, createQuiz); // Create quiz
router.get('/', protect, getQuizzes); // Get all quizzes
router.get('/:id', protect, getQuizById); // Get single quiz
router.put('/:id', protect, updateQuiz); // Update quiz
router.delete('/:id', protect, deleteQuiz); // Delete quiz
router.post('/:id/take', protect, takeQuiz); // Submit quiz answers

module.exports = router;
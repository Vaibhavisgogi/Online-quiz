const Quiz = require('../models/Quiz');
const Result = require('../models/Result');
const User = require('../models/User');

exports.createQuiz = async (req, res) => {
  try {
    const { title, description, subject, topic, questions } = req.body;

    if (!title || !questions || questions.length === 0) {
      return res.status(400).json({ msg: 'Title and questions are required' });
    }

    const quiz = await Quiz.create({
      title,
      description,
      subject,
      topic,
      questions,
      createdBy: req.user._id
    });

    res.status(201).json({
      msg: 'Quiz created successfully',
      quiz
    });
  } catch (err) {
    res.status(500).json({ msg: 'Error creating quiz', error: err.message });
  }
};

exports.getQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find().populate('createdBy', 'name email');
    res.status(200).json(quizzes);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching quizzes', error: err.message });
  }
};

exports.getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).populate('createdBy', 'name email');

    if (!quiz) {
      return res.status(404).json({ msg: 'Quiz not found' });
    }

    res.status(200).json(quiz);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching quiz', error: err.message });
  }
};

exports.takeQuiz = async (req, res) => {
  try {
    const { answers } = req.body;

    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ msg: 'Quiz not found' });
    }

    if (!answers || answers.length === 0) {
      return res.status(400).json({ msg: 'Answers are required' });
    }

    let score = 0;
    quiz.questions.forEach((q) => {
      const userAnswer = answers.find(a => a.questionId.toString() === q._id.toString());
      if (userAnswer && userAnswer.selectedOption === q.correctAnswer) {
        score++;
      }
    });

    const totalQuestions = quiz.questions.length;
    const percentage = ((score / totalQuestions) * 100).toFixed(2);

    const result = await Result.create({
      user: req.user._id,
      quiz: quiz._id,
      score,
      totalQuestions,
      percentage,
      userAnswers: answers.map(a => ({
        questionId: a.questionId,
        selectedOption: a.selectedOption
      }))
    });

    // Award Coins: 10 coins per correct answer
    const coinsEarned = score * 10;
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $inc: { coins: coinsEarned } },
      { new: true }
    );

    res.status(201).json({
      msg: 'Quiz submitted successfully',
      result: {
        score,
        totalQuestions,
        percentage,
        coinsEarned,
        totalCoins: updatedUser.coins,
        ...result._doc
      }
    });
  } catch (err) {
    res.status(500).json({ msg: 'Error submitting quiz', error: err.message });
  }
};

exports.updateQuiz = async (req, res) => {
  try {
    const { title, description, subject, topic, questions } = req.body;
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({ msg: 'Quiz not found' });
    }

    // Check if the user is the creator or an admin
    if (quiz.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Not authorized to update this quiz' });
    }

    quiz.title = title || quiz.title;
    quiz.description = description || quiz.description;
    quiz.subject = subject || quiz.subject;
    quiz.topic = topic || quiz.topic;
    quiz.questions = questions || quiz.questions;

    await quiz.save();
    res.status(200).json({ msg: 'Quiz updated successfully', quiz });
  } catch (err) {
    res.status(500).json({ msg: 'Error updating quiz', error: err.message });
  }
};

exports.deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({ msg: 'Quiz not found' });
    }

    // Check if the user is the creator or an admin
    if (quiz.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Not authorized to delete this quiz' });
    }

    await quiz.deleteOne();
    res.status(200).json({ msg: 'Quiz deleted successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Error deleting quiz', error: err.message });
  }
};

exports.autoGenerateQuiz = async (req, res) => {
  try {
    const { title, topic, questionCount } = req.body;

    if (!topic || !title) {
      return res.status(400).json({ msg: 'Title and Topic are required for auto-generation' });
    }

    let count = parseInt(questionCount) || 5;
    if (count > 50) count = 50;
    const questions = [];

    // Simulating AI generation with intelligent templates
    const templates = [
      {
        q: "What is the primary purpose of {topic}?",
        a: "To provide a foundational framework for {title}",
        o: ["To increase complexity", "To reduce efficiency", "To provide a foundational framework for {title}", "No specific purpose"]
      },
      {
        q: "Which of the following is a key characteristic of {topic}?",
        a: "Scalability and adaptability within {title}",
        o: ["Rigid structure", "Scalability and adaptability within {title}", "Manual overhead", "Incompatibility"]
      },
      {
        q: "How does {topic} interact with {title}?",
        a: "By providing essential data structures and logic",
        o: ["By providing essential data structures and logic", "It remains isolated", "By slowing down processes", "Only through manual triggers"]
      },
      {
        q: "What is a common challenge when implementing {topic}?",
        a: "Integration complexity with existing {title} systems",
        o: ["Too many resources", "Integration complexity with existing {title} systems", "Lack of documentation", "None"]
      },
      {
        q: "Which benefit is most associated with {topic}?",
        a: "Enhanced performance and reliability",
        o: ["Cost increase", "Complexity overhead", "Enhanced performance and reliability", "Legacy support"]
      }
    ];

    for (let i = 0; i < count; i++) {
      const template = templates[i % templates.length];
      const questionText = template.q.replace(/{topic}/g, topic).replace(/{title}/g, title);
      const correctAnswer = template.a.replace(/{topic}/g, topic).replace(/{title}/g, title);
      const options = template.o.map(opt => opt.replace(/{topic}/g, topic).replace(/{title}/g, title));

      // Shuffle options slightly (just move correct answer)
      const shuffledOptions = [...options].sort(() => Math.random() - 0.5);

      questions.push({
        questionText,
        options: shuffledOptions,
        correctAnswer,
        solution: `${topic} is essential for ${title} because it ${correctAnswer.toLowerCase()}.`
      });
    }

    res.status(200).json({ questions });
  } catch (err) {
    res.status(500).json({ msg: 'Error auto-generating quiz', error: err.message });
  }
};
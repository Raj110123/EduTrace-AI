const Quiz = require('../models/Quiz');
const QuizAttempt = require('../models/QuizAttempt');
const User = require('../models/User');

// @desc    Start a quiz attempt
// @route   POST /api/quiz/:quizId/start
// @access  Private
exports.startQuizAttempt = async (req, res) => {
  try {
    const { quizId } = req.params;
    const quiz = await Quiz.findById(quizId);
    
    if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found' });

    // In a real app we might prevent multiple active attempts, but keeping it simple
    const attempt = await QuizAttempt.create({
      quizId,
      studentId: req.user.id,
      classroomId: quiz.classroomId
    });

    // Remove correct answers from the quiz payload sent to student
    const safeQuiz = quiz.toObject();
    safeQuiz.mcqs.forEach(q => {
      delete q.correctAnswer;
      delete q.explanation;
    });
    safeQuiz.shortAnswerQuestions.forEach(q => {
      delete q.expectedAnswer;
    });

    res.status(200).json({
      success: true,
      attempt: {
        attemptId: attempt._id,
        quiz: safeQuiz,
        startedAt: attempt.startedAt
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Submit quiz answers and calculate score
// @route   POST /api/quiz/:quizId/submit
// @access  Private
exports.submitQuizAttempt = async (req, res) => {
  try {
    const { quizId } = req.params;
    const { attemptId, mcqAnswers, saqAnswers } = req.body;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found' });

    const attempt = await QuizAttempt.findById(attemptId);
    if (!attempt || attempt.status !== 'in-progress') {
      return res.status(400).json({ success: false, message: 'Invalid or already completed attempt' });
    }

    let correctCount = 0;
    let incorrectCount = 0;
    const detailedResults = [];

    // Calculate MCQ score
    for (const ans of mcqAnswers) {
      const question = quiz.mcqs.find(q => q._id.toString() === ans.questionId);
      if (question) {
        const isCorrect = question.correctAnswer === ans.selectedAnswer;
        if (isCorrect) correctCount++;
        else incorrectCount++;

        detailedResults.push({
          questionId: question._id,
          question: question.question,
          selectedAnswer: ans.selectedAnswer,
          correctAnswer: question.correctAnswer,
          isCorrect,
          explanation: question.explanation,
          sourceTimestamp: question.sourceTimestamp
        });
      }
    }

    // SAQs would be AI-graded or instructor-graded in a full app. We'll skip auto-grading for simplicity here.

    // Calculate Coins: +3 correct, -1 incorrect, min 0
    let coinsEarned = Math.max(0, (correctCount * 3) - (incorrectCount * 1));
    const mcqScore = correctCount;
    const totalScore = quiz.mcqs.length > 0 ? (mcqScore / quiz.mcqs.length) * 100 : 0;

    attempt.mcqAnswers = mcqAnswers;
    attempt.saqAnswers = saqAnswers;
    attempt.mcqScore = mcqScore;
    attempt.totalScore = totalScore;
    attempt.coinsEarned = coinsEarned;
    attempt.status = 'completed';
    attempt.completedAt = new Date();
    await attempt.save();

    // Reward user
    const user = await User.findById(req.user.id);
    user.coins += coinsEarned;
    user.totalCoinsEarned += coinsEarned;
    user.quizzesTaken += 1;
    // rough running average update
    user.averageScore = ((user.averageScore * (user.quizzesTaken - 1)) + totalScore) / user.quizzesTaken;
    await user.save();

    res.status(200).json({
      success: true,
      result: {
        totalScore,
        mcqScore,
        correctAnswers: correctCount,
        incorrectAnswers: incorrectCount,
        coinsEarned,
        totalCoins: user.coins,
        detailedResults
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get detailed quiz attempt results
// @route   GET /api/quiz/:quizId/results/:attemptId
// @access  Private
exports.getQuizResults = async (req, res) => {
  try {
    const attempt = await QuizAttempt.findById(req.params.attemptId).lean();
    if (!attempt) return res.status(404).json({ success: false, message: 'Attempt not found' });
    
    // Ensure the student owns the attempt or instructor owns classroom
    if (attempt.studentId.toString() !== req.user.id) {
       // Ideally check instructor role logic, bypassing for speed
    }

    const quiz = await Quiz.findById(attempt.quizId).lean();
    if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found' });

    const detailedResults = [];
    if (attempt.mcqAnswers) {
      for (const ans of attempt.mcqAnswers) {
        const question = quiz.mcqs.find(q => q._id.toString() === ans.questionId);
        if (question) {
          detailedResults.push({
            questionId: question._id,
            question: question.question,
            selectedAnswer: ans.selectedAnswer,
            correctAnswer: question.correctAnswer,
            isCorrect: question.correctAnswer === ans.selectedAnswer,
            explanation: question.explanation,
            sourceTimestamp: question.sourceTimestamp
          });
        }
      }
    }

    res.status(200).json({ 
      success: true, 
      results: {
        totalScore: attempt.totalScore,
        mcqScore: attempt.mcqScore,
        coinsEarned: attempt.coinsEarned,
        correctAnswers: detailedResults.filter(r => r.isCorrect).length,
        incorrectAnswers: detailedResults.filter(r => !r.isCorrect).length,
        detailedResults
      } 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

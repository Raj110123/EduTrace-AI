const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { startQuizAttempt, submitQuizAttempt, getQuizResults } = require('../controllers/quiz');

router.post('/:quizId/start', protect, startQuizAttempt);
router.post('/:quizId/submit', protect, submitQuizAttempt);
router.get('/:quizId/results/:attemptId', protect, getQuizResults);

module.exports = router;

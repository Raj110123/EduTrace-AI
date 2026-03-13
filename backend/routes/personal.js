const express = require('express');
const router = express.Router();
const { submitVideo, generateQuiz, generateSummary, getVideo } = require('../controllers/personal');
const { protect } = require('../middleware/auth');

router.post('/video', protect, submitVideo);
router.get('/video/:videoId', protect, getVideo);
router.post('/generate-quiz', protect, generateQuiz);
router.post('/generate-summary', protect, generateSummary);

module.exports = router;

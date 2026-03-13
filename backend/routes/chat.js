const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { askQuestion, getChatHistory } = require('../controllers/chat');

router.post('/:videoId', protect, askQuestion);
router.get('/:videoId/history', protect, getChatHistory);

module.exports = router;

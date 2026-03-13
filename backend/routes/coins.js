const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getCoinBalance, getCoinHistory } = require('../controllers/coins');

router.get('/balance', protect, getCoinBalance);
router.get('/history', protect, getCoinHistory);

module.exports = router;

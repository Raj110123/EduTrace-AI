const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getStoreItems, redeemItem } = require('../controllers/store');

router.get('/items', protect, getStoreItems);
router.post('/redeem', protect, redeemItem);

module.exports = router;

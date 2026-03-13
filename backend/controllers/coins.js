const User = require('../models/User');
const QuizAttempt = require('../models/QuizAttempt');

// @desc    Get user's coin balance and stats
// @route   GET /api/coins/balance
// @access  Private
exports.getCoinBalance = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    res.status(200).json({
      success: true,
      coins: user.coins,
      totalCoinsEarned: user.totalCoinsEarned,
      quizzesTaken: user.quizzesTaken
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get coin transaction history
// @route   GET /api/coins/history
// @access  Private
exports.getCoinHistory = async (req, res) => {
  try {
    // For simplicity, we can fetch QuizAttempts that have coinsEarned > 0
    const attempts = await QuizAttempt.find({ 
      studentId: req.user.id, 
      status: 'completed', 
      coinsEarned: { $gt: 0 } 
    }).populate('quizId', 'title');

    // And redeemed items
    const user = await User.findById(req.user.id).populate('redeemedItems.itemId');

    const transactions = [];

    // Format earned
    attempts.forEach(a => {
      transactions.push({
        type: 'earned',
        amount: a.coinsEarned,
        source: 'quiz attempt',
        sourceId: a.quizId ? a.quizId.title : 'Deleted Quiz',
        timestamp: a.completedAt
      });
    });

    // Format spent
    user.redeemedItems.forEach(r => {
      transactions.push({
        type: 'spent',
        amount: r.coinsSpent || (r.itemId ? r.itemId.cost : 0),
        source: 'store redemption',
        sourceId: r.itemId ? r.itemId.name : 'Unknown Item',
        timestamp: r.redeemedAt
      });
    });

    // Sort descending by date
    transactions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    res.status(200).json({ success: true, transactions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

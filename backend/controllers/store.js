const StoreItem = require('../models/StoreItem');
const User = require('../models/User');

// @desc    Get all available store items
// @route   GET /api/store/items
// @access  Private
exports.getStoreItems = async (req, res) => {
  try {
    const items = await StoreItem.find({ isAvailable: true });
    res.status(200).json({ success: true, items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Redeem an item
// @route   POST /api/store/redeem
// @access  Private
exports.redeemItem = async (req, res) => {
  try {
    const { itemId } = req.body;
    
    // Using transaction would be better here in production
    const item = await StoreItem.findById(itemId);
    if (!item || !item.isAvailable) {
      return res.status(404).json({ success: false, error: 'NOT_FOUND', message: 'Item not found or unavailable' });
    }

    const user = await User.findById(req.user.id);
    if (user.coins < item.cost) {
      return res.status(400).json({ success: false, error: 'INSUFFICIENT_COINS', message: `You need ${item.cost} coins but only have ${user.coins}.` });
    }

    // Process redemption
    user.coins -= item.cost;
    user.redeemedItems.push({
      itemId: item._id,
      coinsSpent: item.cost,
      redeemedAt: new Date()
    });
    
    await user.save();

    item.totalRedemptions += 1;
    await item.save();

    res.status(200).json({
      success: true,
      message: 'Item redeemed successfully!',
      remainingCoins: user.coins,
      redeemedItem: item
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const mongoose = require('mongoose');

const storeItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  category: { type: String, enum: ['theme', 'badge', 'avatar', 'certificate', 'other'], default: 'other' },
  cost: { type: Number, required: true },
  image: { type: String },
  isAvailable: { type: Boolean, default: true },
  totalRedemptions: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('StoreItem', storeItemSchema);

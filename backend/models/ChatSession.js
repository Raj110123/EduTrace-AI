const mongoose = require('mongoose');

const chatSessionSchema = new mongoose.Schema({
  videoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Video', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  messages: [
    {
      role: { type: String, enum: ['user', 'assistant'] },
      content: { type: String },
      shortAnswer: { type: String },
      mainAnswer: { type: String },
      evidence: [
        {
          transcriptExcerpt: { type: String },
          timestamp: {
            startTime: Number,
            endTime: Number
          },
          relevanceNote: { type: String }
        }
      ],
      confidenceLevel: { type: String, enum: ['high', 'medium', 'low'] },
      timestamp: { type: Date, default: Date.now }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('ChatSession', chatSessionSchema);

const ChatSession = require('../models/ChatSession');
const Video = require('../models/Video');
const n8nService = require('../services/n8nService');

// @desc    Ask a question about a video
// @route   POST /api/chat/:videoId
// @access  Private
exports.askQuestion = async (req, res) => {
  try {
    const { videoId } = req.params;
    const { question, sessionId } = req.body;

    const video = await Video.findById(videoId);
    if (!video) return res.status(404).json({ success: false, message: 'Video not found' });

    let chatSession;
    if (sessionId) {
      chatSession = await ChatSession.findById(sessionId);
      if (!chatSession) return res.status(404).json({ success: false, message: 'Chat session not found' });
    } else {
      chatSession = await ChatSession.create({
        videoId,
        userId: req.user.id,
        messages: []
      });
    }

    // Add user message
    chatSession.messages.push({
      role: 'user',
      content: question,
      timestamp: new Date()
    });

    // We pass history to n8n (excluding the current question)
    const chatHistory = chatSession.messages.slice(0, -1).map(m => ({
      role: m.role,
      content: m.role === 'assistant' ? m.mainAnswer : m.content
    }));

    // Call n8n to generate chat response
    let n8nResponse;
    try {
      n8nResponse = await n8nService.resolveDoubt({
        transcript: video.transcript.raw,
        video_id: video._id.toString(),
        question,
        chat_history: chatHistory
      });
    } catch(err) {
      return res.status(504).json({ success: false, error: 'AI_PROCESSING_TIMEOUT', message: err.message });
    }

    // If we pretend n8n returned valid JSON matching the chat schema
    const assistantData = n8nResponse?.response || {
      shortAnswer: 'AI could not be reached.',
      mainAnswer: 'Please ensure the n8n webhook is active and returning the correct schema.',
      evidence: [],
      confidenceLevel: 'low'
    };

    const assistantMessage = {
      role: 'assistant',
      shortAnswer: assistantData.shortAnswer,
      mainAnswer: assistantData.mainAnswer,
      evidence: assistantData.evidence,
      confidenceLevel: assistantData.confidenceLevel,
      timestamp: new Date()
    };

    chatSession.messages.push(assistantMessage);
    await chatSession.save();

    res.status(200).json({
      success: true,
      sessionId: chatSession._id,
      response: assistantData
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get chat history for a specific video
// @route   GET /api/chat/:videoId/history
// @access  Private
exports.getChatHistory = async (req, res) => {
  try {
    const { videoId } = req.params;
    const sessions = await ChatSession.find({ videoId, userId: req.user.id }).sort({ updatedAt: -1 });
    
    res.status(200).json({ success: true, sessions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

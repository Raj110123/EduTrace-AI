const Video = require('../models/Video');
const { fetchTranscript } = require('../services/transcriptService');
const n8nService = require('../services/n8nService');
const Quiz = require('../models/Quiz');

exports.getVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.videoId);
    if (!video) return res.status(404).json({ success: false, message: 'Video not found' });
    res.status(200).json({ success: true, video });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.submitVideo = async (req, res) => {
  try {
    const { youtubeUrl } = req.body;
    
    // Fetch transcript
    let transcriptData;
    try {
      transcriptData = await fetchTranscript(youtubeUrl);
    } catch (e) {
      return res.status(400).json({ success: false, error: 'TRANSCRIPT_NOT_AVAILABLE', message: e.message });
    }

    // Save Video entry
    const video = await Video.create({
      youtubeUrl,
      youtubeVideoId: transcriptData.videoId,
      title: 'YouTube Video', // In a real app we'd fetch actual metadata
      thumbnail: `https://img.youtube.com/vi/${transcriptData.videoId}/default.jpg`,
      transcript: {
        raw: transcriptData.raw,
        segments: transcriptData.segments
      },
      uploadedBy: req.user.id,
      mode: 'personal' // explicitly personal mode
    });

    res.status(200).json({
      success: true,
      video,
      message: 'Transcript extracted successfully. Generating quiz...'
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.generateQuiz = async (req, res) => {
  try {
    const { videoId, numMCQs = 10, numSAQs = 5, difficulty = 'medium' } = req.body;
    
    const video = await Video.findById(videoId);
    if (!video) return res.status(404).json({ success: false, message: 'Video not found' });

    // Call n8n to generate quiz
    let n8nResponse;
    try {
      n8nResponse = await n8nService.generateQuiz({
        transcript: video.transcript.raw,
        video_id: video._id.toString(),
        video_title: video.title,
        num_mcqs: numMCQs,
        num_saqs: numSAQs,
        difficulty
      });
    } catch(err) {
      return res.status(504).json({ success: false, error: 'AI_PROCESSING_TIMEOUT', message: err.message });
    }

    // If we pretend n8n returned valid JSON matching the schema
    const quizData = n8nResponse?.mcqs ? n8nResponse : {
      title: `${video.title} Quiz`,
      videoId: video._id,
      createdBy: req.user.id,
      mode: 'personal',
      difficulty,
      isPublished: true, // Personal is auto published
      mcqs: [],
      shortAnswerQuestions: [],
      totalMCQs: 0,
      totalSAQs: 0
    };

    const quiz = await Quiz.create({
      ...quizData,
      videoId: video._id,
      createdBy: req.user.id,
      mode: 'personal'
    });

    res.status(200).json({ success: true, quiz });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.generateSummary = async (req, res) => {
  try {
    const { videoId } = req.body;
    const video = await Video.findById(videoId);
    if (!video) return res.status(404).json({ success: false, message: 'Video not found' });

    let n8nResponse;
    try {
      n8nResponse = await n8nService.generateSummary({
        transcript: video.transcript.raw,
        video_id: video._id.toString(),
        video_title: video.title
      });
    } catch(err) {
      return res.status(504).json({ success: false, error: 'AI_PROCESSING_TIMEOUT', message: err.message });
    }

    if (n8nResponse && n8nResponse.summary) {
      video.summary = n8nResponse.summary;
      await video.save();
    }

    res.status(200).json({ success: true, summary: n8nResponse });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

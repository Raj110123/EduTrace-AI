const mongoose = require('mongoose');

const quizAttemptSchema = new mongoose.Schema({
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  classroomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Classroom', default: null },
  mcqAnswers: [
    {
      questionId: { type: mongoose.Schema.Types.ObjectId },
      selectedAnswer: { type: String }, // A, B, C, D
      isCorrect: { type: Boolean },
      timeTaken: { type: Number } // seconds
    }
  ],
  saqAnswers: [
    {
      questionId: { type: mongoose.Schema.Types.ObjectId },
      answer: { type: String },
      score: { type: Number, default: 0 }
    }
  ],
  totalScore: { type: Number, default: 0 }, // percentage
  mcqScore: { type: Number, default: 0 }, // raw count
  coinsEarned: { type: Number, default: 0 },
  startedAt: { type: Date, default: Date.now },
  completedAt: { type: Date },
  status: { type: String, enum: ['in-progress', 'completed', 'abandoned'], default: 'in-progress' }
}, { timestamps: true });

module.exports = mongoose.model('QuizAttempt', quizAttemptSchema);

const mongoose = require('mongoose');

const classroomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  instructorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  classCode: { type: String, unique: true, required: true },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  videos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Video' }],
  quizzes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' }],
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Classroom', classroomSchema);

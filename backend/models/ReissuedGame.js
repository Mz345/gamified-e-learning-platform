const mongoose = require('mongoose');

const reissuedGameSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  subjectName: { type: String, required: true },
  gameName: { type: String, required: true },
  reissuedAt: { type: Date, default: Date.now },
  played: { type: Boolean, default: false }
});

module.exports = mongoose.model('ReissuedGame', reissuedGameSchema);

const mongoose = require("mongoose");

// Level score schema
const levelScoreSchema = new mongoose.Schema({
  score: Number,
  date: Date,
  isLocked: Boolean,
}, { _id: false });

// Game schema
const gameSchema = new mongoose.Schema({
  gameName: String,
  levelScore: levelScoreSchema,
  played: { type: Boolean, default: false }
}, { _id: false });

// Subject schema
const subjectSchema = new mongoose.Schema({
  subjectName: String,
  games: {
    type: [gameSchema],
    default: [],
  }
}, { _id: false });

// Student schema
const studentSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  profileImage: {
    type: String,
    default: '' // will hold image URL or file path like '/uploads/profile123.png'
  },
  subjects: {
    type: [subjectSchema],
    default: [
      { subjectName: "English", games: [] },
      { subjectName: "Maths", games: [] },
      { subjectName: "Science", games: [] },
      { subjectName: "History", games: [] },
      { subjectName: "Computer Science", games: [] }
    ]
  }
});

module.exports = mongoose.model("Student", studentSchema);

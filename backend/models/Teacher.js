const mongoose = require("mongoose");

const TeacherSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  profileImage: {
    type: String,
    default: '' // stores image file path or URL
  }
});

module.exports = mongoose.model("Teacher", TeacherSchema);
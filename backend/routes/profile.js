// routes/profile.js
const express = require("express");
const { imageUpload } = require("../utils/multer");
const Student = require("../models/Student");
const Teacher = require("../models/Teacher");

const router = express.Router();

router.post(
  "/upload-profile/:role/:id",
  imageUpload.single("profileImage"),
  async (req, res) => {
    const { role, id } = req.params;

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const imagePath = `/uploads/${req.file.filename}`;

    try {
      let user;

      if (role === "student") {
        user = await Student.findByIdAndUpdate(
          id,
          { profileImage: imagePath },
          { new: true }
        );
      } else if (role === "teacher") {
        user = await Teacher.findByIdAndUpdate(
          id,
          { profileImage: imagePath },
          { new: true }
        );
      } else {
        return res.status(400).json({ error: "Invalid role" });
      }

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.status(200).json({
        message: "Profile image updated successfully",
        profileImage: user.profileImage,
      });
    } catch (err) {
      console.error("Profile image upload error:", err);
      res.status(500).json({ error: "Failed to update profile image" });
    }
  }
);

module.exports = router;

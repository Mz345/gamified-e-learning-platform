const express = require("express");
const router = express.Router();
const Student = require("../models/Student");
const ReissuedGame = require("../models/ReissuedGame");

router.post("/", async (req, res) => {
  try {
    const { subjectName, gameName } = req.body;
    console.log("📩 Reissue request:", { subjectName, gameName });

    // Helper function to normalize game names (case-insensitive + space-insensitive)
    const normalize = (str) => str.toLowerCase().replace(/\s+/g, '');

    // Find all students with the given subject
    const students = await Student.find({ "subjects.subjectName": subjectName });
    console.log(`Found ${students.length} students with subject "${subjectName}"`);

    let updatedCount = 0;

    for (const student of students) {
      console.log(`Checking student: ${student._id}`);

      // Find the subject inside student's subjects array
      const subject = student.subjects.find(
        (s) => s.subjectName.toLowerCase() === subjectName.toLowerCase()
      );
      if (!subject) {
        console.log(`No subject "${subjectName}" for student ${student._id}`);
        continue;
      }

      // Match game name after normalization
      const game = subject.games.find(
        (g) => normalize(g.gameName) === normalize(gameName)
      );

      if (!game) {
        console.log(`No game "${gameName}" for student ${student._id} in subject "${subjectName}"`);
        continue;
      }

      // Reset 'played' flag
      game.played = false;

      // Reset or initialize levelScore
      if (game.levelScore) {
        game.levelScore.isLocked = false;
      } else {
        game.levelScore = {
          score: 0,
          date: new Date(),
          isLocked: false,
        };
      }

      // Save the updated student
      await student.save();
      updatedCount++;

      // Save a reissue record (optional)
      const reissueRecord = new ReissuedGame({
        studentId: student._id,
        subjectName,
        gameName,
        played: false,
      });
      await reissueRecord.save();
    }

    console.log(`✅ Reissued game for ${updatedCount} students.`);
    res.status(200).json({ message: `Reissued game for ${updatedCount} students.` });

  } catch (error) {
    console.error("🔥 Server error in /api/reissue:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

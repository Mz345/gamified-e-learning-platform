const express = require("express");
const Student = require("../models/Student");
const ReissuedGame = require("../models/ReissuedGame");
const { getRangeStart } = require("../utils/dateRange");
const router = express.Router();

// Helper: Flatten scores and sum by date range
const sumScores = (games, filterDate = null) => {
  return games.reduce((sum, game) => {
    const levelScore = game.levelScore;
    if (levelScore && (!filterDate || new Date(levelScore.date) >= filterDate)) {
      sum += levelScore.score || 0;
    }
    return sum;
  }, 0);
};

// 🏆 GET leaderboard: total, daily, weekly, monthly
router.get("/", async (req, res) => {
  const { range } = req.query; // range = daily / weekly / monthly
  let filterDate = null;

  if (range === 'daily') {
    filterDate = getRangeStart('daily');
  } else if (range === 'weekly') {
    filterDate = getRangeStart('weekly');
  } else if (range === 'monthly') {
    filterDate = getRangeStart('monthly');
  }

  try {
    const students = await Student.find();

    const leaderboard = students.map(student => {
      let totalPoints = 0;

      student.subjects.forEach(subject => {
        totalPoints += sumScores(subject.games, filterDate);
      });

      return {
        _id: student._id,
        name: student.name,
        totalPoints,
      };
    });

    leaderboard.sort((a, b) => b.totalPoints - a.totalPoints);

    res.json(leaderboard);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update score for a student with reissue check
router.put("/update/:studentId", async (req, res) => {
  const { subjectName, gameName, score } = req.body;
  const studentId = req.params.studentId;

  try {
    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ message: "Student not found" });

    // Find subject and game (case-insensitive subject)
    const subject = student.subjects.find(s => s.subjectName.toLowerCase() === subjectName.toLowerCase());
    if (!subject) {
      console.log('Available subjects:', student.subjects);
      return res.status(404).json({ message: "Subject not found" });
    }

    const game = subject.games.find(g => g.gameName === gameName);

    // Check if this game was reissued and whether student played after reissue
    const reissueRecord = await ReissuedGame.findOne({ subjectName, gameName });

    if (reissueRecord) {
      if (reissueRecord.played) {
        // Already played after reissue -> block update
        return res.status(403).json({ message: "Game already completed and locked after reissue" });
      } else {
        // Allow score update, mark played=true after update
        if (game) {
          game.levelScore = { score, date: new Date(), isLocked: true };
        } else {
          subject.games.push({
            gameName,
            levelScore: { score, date: new Date(), isLocked: true }
          });
        }
        await student.save();

        // Mark reissue record as played
        reissueRecord.played = true;
        await reissueRecord.save();

        return res.json({ message: "Score updated successfully after reissue" });
      }
    }

    // No reissue record, fallback to your existing logic
    if (game) {
      if (game.levelScore && game.levelScore.isLocked) {
        return res.status(403).json({ message: "Game already completed and locked" });
      }
      game.levelScore = { score, date: new Date(), isLocked: true };
    } else {
      subject.games.push({
        gameName,
        levelScore: { score, date: new Date(), isLocked: true },
      });
    }

    await student.save();
    res.json({ message: "Score updated successfully" });

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;

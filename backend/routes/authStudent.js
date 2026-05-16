// routes/student.js
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Student = require("../models/Student");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "secretkey";

// REGISTER
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await Student.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const subjects = [
      { subjectName: "English", games: [] },
      { subjectName: "Maths", games: [] },
      { subjectName: "Science", games: [] },
      { subjectName: "History", games: [] },
      { subjectName: "Computer Science", games: [] },
    ];

    const user = await Student.create({
      name,
      email,
      password: hashed,
      subjects,
      profileImage: "/avatars/default-avatar.png", // default profile image
    });

    res.status(201).json({ message: "Student registered successfully", user });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ error: "Registration failed" });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await Student.findOne({ email });
    if (!user) return res.status(400).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1d" });

    res.json({
      token,
      _id: user._id,
      name: user.name,
      email: user.email,
      profileImage: user.profileImage || "/avatars/default-avatar.png",
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Login failed" });
  }
});

module.exports = router;
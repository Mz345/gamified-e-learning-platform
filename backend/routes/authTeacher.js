// routes/teacher.js
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Teacher = require("../models/Teacher");

const router = express.Router();

const TEACHER_SECRET = process.env.TEACHER_SECRET || "supersecurepassword";
const JWT_SECRET = process.env.JWT_SECRET || "secretkey";

// REGISTER
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (password !== TEACHER_SECRET) {
    return res.status(403).json({ error: "Unauthorized registration attempt" });
  }

  try {
    const existingUser = await Teacher.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const teacher = await Teacher.create({
      name,
      email,
      password: hashed,
      profileImage: "/avatars/default-avatar.png",
    });

    res.status(201).json({ message: "Teacher registered successfully", teacher });
  } catch (err) {
    console.error("Teacher registration error:", err);
    res.status(500).json({ error: "Registration failed" });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const teacher = await Teacher.findOne({ email });
    if (!teacher) return res.status(400).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, teacher.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: teacher._id }, JWT_SECRET, { expiresIn: "1d" });

    res.json({
      token,
      _id: teacher._id,
      name: teacher.name,
      email: teacher.email,
      profileImage: teacher.profileImage || "/avatars/default-avatar.png",
    });
  } catch (err) {
    console.error("Teacher login error:", err);
    res.status(500).json({ error: "Login failed" });
  }
});

module.exports = router;
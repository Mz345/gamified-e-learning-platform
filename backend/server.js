import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import http from 'http';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import teacherRoutes from './routes/authTeacher.js';
import studentRoutes from './routes/authStudent.js';
import leaderboardRoutes from './routes/LeaderBoard.js';
import messageRoutes from './routes/message.js';
import reissueRoutes from './routes/gameRoutes.js';

import profileRouter from './routes/profile.js';
import { initSocket } from './socket.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

// Fix __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());

// Serve uploaded files statically (important for avatar images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/eLearningDB')
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Initialize Socket.IO and attach io instance to app
initSocket(server, app);

// Routes
app.use('/api/teacher', teacherRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/reissue', reissueRoutes);

// New upload route for avatar uploads
app.use('/api/profile', profileRouter);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

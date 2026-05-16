import express from 'express';
import Message from '../models/Messages.js';
import { upload } from '../utils/multer.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

router.post('/', upload.single('file'), async (req, res) => {
  try {
    const { senderName, senderModel, text } = req.body;
    const file = req.file;

    const newMessage = new Message({
      senderName,
      senderModel,
      text: text || '',
      fileUrl: file ? `/uploads/${file.filename}` : null,
      fileType: file ? file.mimetype : null,
    });

    await newMessage.save();

    const io = req.app.get('io');
    if (io) io.emit('receiveMessage', newMessage);

    res.status(201).json(newMessage);
  } catch (err) {
    res.status(500).json({ error: 'Failed to send message' });
  }
});

export default router;

import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  senderName: { type: String, required: true },
  senderModel: { type: String, required: true, enum: ['student', 'teacher'] },
  text: { type: String, default: '' },
  fileUrl: { type: String, default: null },
  fileType: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Message', messageSchema);

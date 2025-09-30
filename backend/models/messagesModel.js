const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const messageSchema = new Schema({
  id: { type: Number, required: true, unique: true },
  user: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: String, required: true },
  userId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

const Message = model('Messages', messageSchema);

module.exports = Message;
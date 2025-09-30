const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const commitSchema = new Schema({
  id: { type: Number, required: true, unique: true },
  hash: { type: String, required: true },
  message: { type: String, required: true },
  author: { type: String, required: true },
  userId: { type: String, required: true },
  timestamp: { type: String, required: true },
  filesChanged: { type: Number, required: true },
  projectId: { type: String, required: true }
}, { timestamps: true });

const Commit = model('Commits', commitSchema);

module.exports = Commit;
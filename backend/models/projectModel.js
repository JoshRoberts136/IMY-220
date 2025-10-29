const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const projectSchema = new Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, required: true },
  language: { type: String, required: true },
  stars: { type: Number, default: 0 },
  forks: { type: Number, default: 0 },
  members: [{ type: String }],
  files: [{
    id: String,
    originalName: String,
    filename: String,
    path: String,
    size: Number,
    mimetype: String,
    uploadedBy: String,
    uploadedAt: Date
  }],
  messages: [{
    id: String,
    userId: String,
    username: String,
    avatar: String,
    message: String,
    timestamp: Date
  }],
  checkedOutBy: { type: String },
  checkedOutAt: { type: Date },
  version: { type: String, default: '1.0.0' },
  hashtags: [{ type: String }],
  lastUpdated: { type: Date, default: Date.now },
  lastCommit: {
    userId: { type: String },
    username: { type: String },
    commitId: { type: String },
    message: { type: String },
    timestamp: { type: Date }
  },
  ownedBy: { type: String, required: true }
}, { timestamps: true });

const Project = model('Projects', projectSchema);

module.exports = Project;
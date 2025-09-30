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
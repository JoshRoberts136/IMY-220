const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const userSchema = new Schema({
  id: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  profile: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    avatar: { type: String },
    title: { type: String },
    bio: { type: String }
  },
  email: { type: String, required: true, unique: true },
  isActive: { type: Boolean, default: true },
  password: { type: String, required: true },
  updatedAt: { type: Date, default: Date.now },
  lastLogin: { type: Date, default: Date.now },
  lastCommit: {
    projectId: { type: String },
    projectName: { type: String },
    commitId: { type: String },
    message: { type: String },
    timestamp: { type: Date }
  }
}, { timestamps: true });

const User = model('Users', userSchema);

module.exports = User;
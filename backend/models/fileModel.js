const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const fileSchema = new Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  status: { type: String, required: true },
  lastModified: { type: String, required: true },
  size: { type: String, required: true },
  author: { type: String, required: true },
  projectId: { type: String, required: true }
}, { timestamps: true });

const File = model('Files', fileSchema);

module.exports = File;
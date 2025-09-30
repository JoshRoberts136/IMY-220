const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const languageSchema = new Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  level: { type: String, required: true },
  yearsExperience: { type: Number, required: true },
  projectsCount: { type: Number, required: true }
}, { timestamps: true });

const Language = model('Languages', languageSchema);

module.exports = Language;
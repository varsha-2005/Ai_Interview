const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  fileUrl: String,
  originalName: String
}, { timestamps: true });

module.exports = mongoose.model("Resume", resumeSchema);
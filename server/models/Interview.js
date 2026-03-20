const mongoose = require("mongoose");

const interviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  resume: { type: mongoose.Schema.Types.ObjectId, ref: "Resume" },
  job: { type: mongoose.Schema.Types.ObjectId, ref: "Job" },
  difficulty: String,
  mode: String,
  status: { type: String, default: "in-progress" }
}, { timestamps: true });

module.exports = mongoose.model("Interview", interviewSchema);
const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  company: String,
  description: String
}, { timestamps: true });

module.exports = mongoose.model("Job", jobSchema);
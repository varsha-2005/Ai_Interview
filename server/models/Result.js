const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema({
  interview: { type: mongoose.Schema.Types.ObjectId, ref: "Interview" },
  scores: {
    resume: Number,
    aptitude: Number,
    technical: Number,
    interview: Number
  },
  feedback: String
}, { timestamps: true });

module.exports = mongoose.model("Result", resultSchema);
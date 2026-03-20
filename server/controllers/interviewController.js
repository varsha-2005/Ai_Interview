const Interview = require("../models/Interview");

exports.startInterview = async (req, res) => {
  const { resumeId, jobId, difficulty, mode } = req.body;

  const interview = await Interview.create({
    user: req.user._id,
    resume: resumeId,
    job: jobId,
    difficulty,
    mode
  });

  res.json(interview);
};
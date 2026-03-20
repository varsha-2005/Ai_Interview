const Interview = require("../models/Interview");

exports.startInterview = async (req, res) => {
  const { jobId, difficulty } = req.body;

  const interview = await Interview.create({
    user: req.user._id,
    job: jobId,
    difficulty,
    status: "in-progress",
  });

  res.json(interview);
};

exports.getQuestions = async (req, res) => {
  const { company, difficulty, type } = req.query;

  // placeholder question set; replace with real question bank
  const sampleQuestions = [
    { _id: "q1", question: `Describe how you'd build a ${company} ${type} system.` },
    { _id: "q2", question: `Explain time complexity for common ${difficulty} algorithms.` },
    { _id: "q3", question: `How do you test and validate production code?` },
  ];

  res.json(sampleQuestions);
};
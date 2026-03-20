const Result = require("../models/Result");

exports.saveResult = async (req, res) => {
  const { interviewId, scores, feedback } = req.body;

  const result = await Result.create({
    interview: interviewId,
    scores,
    feedback,
  });

  res.json(result);
};

exports.generateResult = async (req, res) => {
  const { interviewId } = req.body;
  const score = Math.floor(60 + Math.random() * 40);
  const feedback =
    score >= 80
      ? "Excellent technical knowledge and problem solving."
      : score >= 65
      ? "Good progress, work on edgecases and optimization."
      : "Please revisit fundamentals and practice more problems.";

  const result = await Result.create({
    interview: interviewId,
    scores: { interview: score },
    feedback,
  });

  res.json(result);
};
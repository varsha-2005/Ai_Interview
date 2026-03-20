const Result = require("../models/Result");

exports.saveResult = async (req, res) => {
  const { interviewId, scores, feedback } = req.body;

  const result = await Result.create({
    interview: interviewId,
    scores,
    feedback
  });

  res.json(result);
};
exports.saveAnswer = async (req, res) => {
  const { interviewId, questionId, answer } = req.body;

  // For now this is a placeholder; implement persistence if needed
  res.json({ interviewId, questionId, answer, saved: true });
};

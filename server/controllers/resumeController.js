const Resume = require("../models/Resume");

exports.uploadResume = async (req, res) => {
  const resume = await Resume.create({
    user: req.user._id,
    fileUrl: req.file.path,
    originalName: req.file.originalname
  });

  res.json(resume);
};
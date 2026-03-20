const Job = require("../models/Job");

exports.createJob = async (req, res) => {
  const { company, description } = req.body;

  const job = await Job.create({
    user: req.user._id,
    company,
    description
  });

  res.json(job);
};
const router = require("express").Router();
const { createJob } = require("../controllers/jobController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, createJob);

module.exports = router;
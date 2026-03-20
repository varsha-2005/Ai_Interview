const router = require("express").Router();
const { uploadResume } = require("../controllers/resumeController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

router.post("/", protect, upload.single("resume"), uploadResume);

module.exports = router;
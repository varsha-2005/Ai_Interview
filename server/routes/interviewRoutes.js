const router = require("express").Router();
const { startInterview, getQuestions } = require("../controllers/interviewController");
const { protect } = require("../middleware/authMiddleware");

router.post("/start", protect, startInterview);
router.get("/questions", protect, getQuestions);

module.exports = router;
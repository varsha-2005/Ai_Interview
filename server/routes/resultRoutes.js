const router = require("express").Router();
const { saveResult, generateResult } = require("../controllers/resultController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, saveResult);
router.post("/generate", protect, generateResult);

module.exports = router;
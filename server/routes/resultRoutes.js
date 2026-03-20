const router = require("express").Router();
const { saveResult } = require("../controllers/resultController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, saveResult);

module.exports = router;
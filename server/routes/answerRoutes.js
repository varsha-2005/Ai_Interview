const router = require('express').Router();
const { saveAnswer } = require('../controllers/answerController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, saveAnswer);

module.exports = router;

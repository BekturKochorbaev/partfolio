const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');
const {
  getMentorship,
  addMentorship
} = require('../controllers/studentMentorshipController');

router.get('/', authenticateToken, getMentorship);
router.post('/', authenticateToken, addMentorship);

module.exports = router;

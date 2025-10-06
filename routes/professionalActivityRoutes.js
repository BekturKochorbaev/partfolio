const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');
const {
  getActivities,
  addActivity
} = require('../controllers/professionalActivityController');

router.get('/', authenticateToken, getActivities);
router.post('/', authenticateToken, addActivity);

module.exports = router;

const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');
const studentAchievementController = require('../controllers/studentAchievementController');

// 🔒 Получить все достижения студента
router.get('/', authenticateToken, studentAchievementController.getAllAchievements);

// 🔒 Добавить новое достижение
router.post('/', authenticateToken, studentAchievementController.addAchievement);

module.exports = router;

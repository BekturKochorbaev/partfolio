const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');
const teachingController = require('../controllers/teachingController');

// 🔒 Получить информацию о преподавании
router.get('/', authenticateToken, teachingController.getTeaching);

// 🔒 Обновить информацию о преподавании
router.put('/', authenticateToken, teachingController.updateTeaching);

module.exports = router;

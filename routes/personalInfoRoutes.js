const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');
const { getInfo, updateInfo, getInfoById } = require('../controllers/personalInfoController');

// 🔓 Публичный маршрут
router.get('/:id', getInfoById);

// 🔒 Защищённые маршруты
router.get('/', authenticateToken, getInfo);
router.put('/', authenticateToken, updateInfo);

module.exports = router;

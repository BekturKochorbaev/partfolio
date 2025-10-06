const express = require('express');
const { register, login } = require('../controllers/authController');
const { updateAvatar, getUserById } = require('../controllers/userController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { uploadAvatar } = require('../utils/uploadConfig');
const router = express.Router();

// 🔐 Регистрация и вход
router.post('/register', register);
router.post('/login', login);

// 🖼 Обновление аватара
router.put('/avatar', authenticateToken, uploadAvatar.single('avatar'), updateAvatar);

// 👤 Получение пользователя по ID
router.get('/:id', getUserById);

module.exports = router;

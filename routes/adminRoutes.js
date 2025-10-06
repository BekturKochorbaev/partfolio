const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');
const checkRole = require('../middleware/checkRole');
const User = require('../models/User');

// 🔐 Все маршруты доступны только админам
router.use(authenticateToken, checkRole('admin'));

// 📄 Получить список всех пользователей (без паролей)
router.get('/users', async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'firstName', 'lastName', 'email', 'role', 'isTeacher'] // 👈 добавлено isTeacher
    });
    res.json(users);
  } catch (error) {
    console.error('❌ Ошибка получения пользователей:', error);
    res.status(500).json({ message: 'Ошибка сервера при получении пользователей' });
  }
});

// ✏️ Обновить роль пользователя (например: admin, teacher)
router.put('/users/:id/role', async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    user.role = role;
    await user.save();

    res.json({ message: 'Роль успешно обновлена', user });
  } catch (error) {
    console.error('❌ Ошибка обновления роли:', error);
    res.status(500).json({ message: 'Ошибка сервера при обновлении роли' });
  }
});

// ✅ Обновить статус преподавателя (isTeacher)
router.put('/users/:id/teacher-status', async (req, res) => {
  try {
    const { isTeacher } = req.body;
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    user.isTeacher = isTeacher;
    await user.save();

    res.json({ message: 'Статус преподавателя обновлён', user });
  } catch (error) {
    console.error('❌ Ошибка обновления isTeacher:', error);
    res.status(500).json({ message: 'Ошибка сервера при обновлении преподавательского статуса' });
  }
});

// 🗑️ Удаление пользователя
router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    await user.destroy();
    res.json({ message: 'Пользователь успешно удалён' });
  } catch (error) {
    console.error('❌ Ошибка удаления пользователя:', error);
    res.status(500).json({ message: 'Ошибка сервера при удалении' });
  }
});

// 🔐 Сброс пароля пользователя
router.post('/users/:id/reset-password', async (req, res) => {
  try {
    const { newPassword } = req.body;
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: 'Пароль должен содержать не менее 6 символов' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: 'Пароль успешно сброшен' });
  } catch (error) {
    console.error('❌ Ошибка сброса пароля:', error);
    res.status(500).json({ message: 'Ошибка сервера при сбросе пароля' });
  }
});

module.exports = router;

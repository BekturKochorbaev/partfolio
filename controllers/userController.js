const path = require('path');
const fs = require('fs');
const { User, PersonalInfo } = require('../models');

// 🔄 Обновление аватара пользователя
exports.updateAvatar = async (req, res) => {
  try {
    const userId = req.user.id; // Получение id из токена

    if (!req.file) {
      return res.status(400).json({ message: 'Файл не загружен' });
    }

    const avatarPath = `/uploads/avatars/${req.file.filename}`;

    // 🔍 Находим пользователя по id
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    // 🧹 Удаляем старый аватар, если есть
    if (user.avatar) {
      const oldAvatarPath = path.join(__dirname, '..', 'uploads', 'avatars', path.basename(user.avatar));
      if (fs.existsSync(oldAvatarPath)) {
        fs.unlink(oldAvatarPath, (err) => {
          if (err) console.warn("⚠️ Не удалось удалить старый аватар:", err);
        });
      }
    }

    // 💾 Сохраняем новый путь в БД
    user.avatar = avatarPath;
    await user.save();

    res.json({ message: '✅ Аватар успешно обновлён', avatar: avatarPath });
  } catch (error) {
    console.error('❌ Ошибка при обновлении аватара:', error);
    res.status(500).json({ message: 'Ошибка при обновлении аватара', error });
  }
};

// ✅ Получение данных преподавателя по ID (для публичного профиля)
exports.getUserById = async (req, res) => {
  try {
    const userId = req.params.id;

    // Проверка на наличие ID и правильность запроса
    if (!userId) {
      return res.status(400).json({ message: 'ID пользователя не предоставлено' });
    }

    // 🔍 Получаем пользователя с привязкой к модели PersonalInfo
    const user = await User.findByPk(userId, {
      attributes: ['id', 'firstName', 'lastName', 'avatar'],
      include: [
        {
          model: PersonalInfo,
          as: 'personalInfo', // Убедитесь, что используется alias
          attributes: ['degree', 'education', 'department', 'diploma']
        }
      ]
    });

    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    res.json(user);
  } catch (error) {
    console.error('❌ Ошибка при получении пользователя:', error);
    res.status(500).json({ message: 'Ошибка при получении данных', error });
  }
};

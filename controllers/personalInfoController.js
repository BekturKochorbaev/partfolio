const PersonalInfo = require("../models/PersonalInfo");
const { User } = require("../models"); // ⬅️ Импортируем модель пользователя

// 🔒 Получение информации текущего пользователя
const getInfo = async (req, res) => {
  try {
    const id = req.user.id;
    const info = await PersonalInfo.findOne({ where: { teacherId: id } });
    const user = await User.findByPk(id); // 🔍 Получаем пользователя по ID

    if (!info) return res.status(404).json({ message: 'Не найдено' });

    const result = {
      ...info.toJSON(),
      avatar: user?.avatar || null,
      diploma: info.diploma || null,
      phoneNumber: info.phoneNumber || null,
      email: info.email || null
    };

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка получения', error: err.message });
  }
};

// 🔒 Обновление информации текущего пользователя
const updateInfo = async (req, res) => {
  try {
    const [info, created] = await PersonalInfo.findOrCreate({
      where: { teacherId: req.user.id },
      defaults: { ...req.body, teacherId: req.user.id }
    });

    if (!created) {
      await info.update(req.body);
    }

    if (req.body.avatar) {
      const user = await User.findByPk(req.user.id);
      if (user) {
        user.avatar = req.body.avatar;
        await user.save();
      }
    }

    res.json({ message: 'Сохранено', info });
  } catch (err) {
    res.status(500).json({ message: 'Ошибка обновления', error: err.message });
  }
};

// 🔓 Получение информации по ID преподавателя (публичный просмотр)
const getInfoById = async (req, res) => {
  try {
    const id = req.params.id;
    const info = await PersonalInfo.findOne({ where: { teacherId: id } });
    const user = await User.findByPk(id);

    if (!info) return res.status(404).json({ message: 'Преподаватель не найден' });

    const result = {
      ...info.toJSON(),
      teacherId: id,
      avatar: user?.avatar || null,
      diploma: info.diploma || null,
      phoneNumber: info.phoneNumber || null,
      email: info.email || null
    };

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка получения профиля', error: err.message });
  }
};

module.exports = { getInfo, updateInfo, getInfoById };

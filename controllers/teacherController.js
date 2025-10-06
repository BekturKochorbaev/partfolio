const { User, PersonalInfo } = require('../models');
const { Op } = require('sequelize');

// 🔍 Поиск преподавателей
exports.searchTeachers = async (req, res) => {
  try {
    const name = req.query.query;

    if (!name || name.trim() === '') {
      return res.status(400).json({ message: 'Введите имя или фамилию для поиска' });
    }

    const users = await User.findAll({
      where: {
        isTeacher: true,
        [Op.or]: [
          { firstName: { [Op.iLike]: `%${name}%` } },
          { lastName: { [Op.iLike]: `%${name}%` } },
        ]
      },
      attributes: ['id', 'firstName', 'lastName', 'email', 'avatar'],
      include: [
        {
          model: PersonalInfo,
          as: 'personalInfo',
          attributes: ['department', 'degree']
        }
      ]
    });

    if (!users.length) {
      return res.status(404).json({ message: 'Преподаватели не найдены' });
    }

    res.json(users);
  } catch (error) {
    console.error("❌ Ошибка в searchTeachers:", error);
    res.status(500).json({
      message: 'Ошибка при поиске преподавателей',
      error: error.message
    });
  }
};

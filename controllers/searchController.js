const { User, PersonalInfo } = require('../models'); 
const { Op, fn, col, where, literal } = require('sequelize');

exports.searchTeachers = async (req, res) => {
  try {
    const { query } = req.query;

    console.log("🔍 Получен запрос на поиск:", query);

    if (!query || query.trim() === '') {
      console.log("⚠️ Пустой запрос, возвращаем []");
      return res.json([]);
    }

    const teachers = await User.findAll({
      where: {
        role: {
          [Op.in]: ['teacher', 'admin_teacher'], // ✅ показываем преподавателей и админов-преподов
        },
        [Op.or]: [
          { firstName: { [Op.iLike]: `%${query}%` } },
          { lastName: { [Op.iLike]: `%${query}%` } },
          // Поиск по полному имени
          where(fn('concat', col('firstName'), ' ', col('lastName')), {
            [Op.iLike]: `%${query}%`
          }),
        ],
      },
      attributes: ['id', 'firstName', 'lastName', 'avatar'],
      include: [
        {
          model: PersonalInfo,
          as: 'personalInfo',
          attributes: ['department', 'degree'],
        },
      ],
    });

    console.log("✅ Найдено преподавателей:", teachers.length);
    res.json(teachers);
  } catch (err) {
    console.error('❌ Ошибка поиска преподавателя:', err);
    res.status(500).json({
      message: 'Ошибка поиска преподавателя',
      error: err.message || err,
    });
  }
};

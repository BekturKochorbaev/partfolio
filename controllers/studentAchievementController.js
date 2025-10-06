const { StudentAchievement } = require('../models');

exports.getAllAchievements = async (req, res) => {
  try {
    const data = await StudentAchievement.findAll({ where: { teacherId: req.user.id } });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка при получении данных', error: err });
  }
};

exports.addAchievement = async (req, res) => {
  try {
    const newItem = await StudentAchievement.create({
      ...req.body,
      teacherId: req.user.id
    });
    res.status(201).json({ message: 'Достижение добавлено', data: newItem });
  } catch (err) {
    res.status(500).json({ message: 'Ошибка при добавлении', error: err });
  }
};

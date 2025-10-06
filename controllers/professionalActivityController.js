const { ProfessionalActivity } = require('../models');

exports.getActivities = async (req, res) => {
  try {
    const data = await ProfessionalActivity.findAll({ where: { teacherId: req.user.id } });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка при получении данных', error: err });
  }
};

exports.addActivity = async (req, res) => {
  try {
    const item = await ProfessionalActivity.create({
      ...req.body,
      teacherId: req.user.id
    });
    res.status(201).json({ message: 'Проф. деятельность добавлена', data: item });
  } catch (err) {
    res.status(500).json({ message: 'Ошибка при добавлении', error: err });
  }
};

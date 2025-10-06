const { StudentMentorship } = require('../models');

exports.getMentorship = async (req, res) => {
  try {
    const data = await StudentMentorship.findAll({ where: { teacherId: req.user.id } });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка при получении данных', error: err });
  }
};

exports.addMentorship = async (req, res) => {
  try {
    const item = await StudentMentorship.create({
      ...req.body,
      teacherId: req.user.id
    });
    res.status(201).json({ message: 'Мероприятие добавлено', data: item });
  } catch (err) {
    res.status(500).json({ message: 'Ошибка при добавлении', error: err });
  }
};

const { TeachingInfo } = require('../models');

exports.getTeaching = async (req, res) => {
  try {
    const info = await TeachingInfo.findOne({ where: { teacherId: req.user.id } });
    if (!info) return res.status(404).json({ message: 'Информация не найдена' });
    res.json(info);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка при получении информации', error: err });
  }
};

exports.updateTeaching = async (req, res) => {
  try {
    const [info, created] = await TeachingInfo.findOrCreate({
      where: { teacherId: req.user.id },
      defaults: { ...req.body, teacherId: req.user.id }
    });

    if (!created) await info.update(req.body);
    res.json({ message: 'Информация сохранена', info });
  } catch (err) {
    res.status(500).json({ message: 'Ошибка при обновлении', error: err });
  }
};

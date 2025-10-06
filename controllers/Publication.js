const Publication = require('../models/Publication');

// 📥 Создание новой записи
exports.create = async (req, res) => {
  try {
    const teacherId = req.user?.id;
    if (!teacherId) return res.status(401).json({ message: 'Нет teacherId в токене.' });

    const record = await Publication.create({ ...req.body, teacherId });
    res.status(201).json(record);
  } catch (error) {
    console.error("Ошибка при создании:", error);
    res.status(500).json({ message: 'Ошибка при добавлении записи.', error });
  }
};

// 📤 Получение всех публикаций преподавателя
exports.getAll = async (req, res) => {
  try {
    const { teacherId } = req.query;
    if (!teacherId) {
      return res.status(400).json({ message: 'Не передан teacherId.' });
    }

    const records = await Publication.findAll({ where: { teacherId } });
    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении записей.', error });
  }
};

// ♻️ Обновление публикации
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    await Publication.update(req.body, { where: { id } });
    const updated = await Publication.findByPk(id);
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при обновлении.', error });
  }
};

// ❌ Удаление публикации
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    await Publication.destroy({ where: { id } });
    res.status(200).json({ message: 'Удалено успешно.' });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при удалении.', error });
  }
};

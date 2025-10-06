const ScientificPublication = require('../models/ScientificPublication');

// 👉 Создание новой публикации
exports.create = async (req, res) => {
  try {
    const teacherId = req.user?.id || req.body.teacherId;

    const {
      publicationTitle,
      journalName,
      publicationYear,
      doi,
      indexing,
      orcidId,
      scopusId,
      elibraryId,
    } = req.body;

    if (!teacherId || !publicationTitle || !journalName || !publicationYear) {
      return res.status(400).json({ message: 'Обязательные поля не заполнены.' });
    }

    const newRecord = await ScientificPublication.create({
      teacherId,
      publicationTitle,
      journalName,
      publicationYear: Number(publicationYear),
      doi,
      indexing,
      orcidId,
      scopusId,
      elibraryId,
      createdAt: new Date(),      // ✅ вручную для рейтинга
      updatedAt: new Date()
    });

    return res.status(201).json(newRecord);
  } catch (error) {
    console.error('❌ Ошибка при создании публикации:', error);
    return res.status(500).json({
      message: 'Ошибка при создании публикации.',
      error: error.message,
    });
  }
};

// 👉 Получение всех публикаций (для авторизованного пользователя)
exports.getAll = async (req, res) => {
  try {
    const { teacherId } = req.query;

    if (!teacherId) {
      return res.status(400).json({ message: 'teacherId обязателен.' });
    }

    const records = await ScientificPublication.findAll({
      where: { teacherId },
      order: [['publicationYear', 'DESC']],
    });

    return res.status(200).json(records);
  } catch (error) {
    console.error('❌ Ошибка при получении публикаций:', error);
    return res.status(500).json({
      message: 'Ошибка при получении публикаций.',
      error: error.message,
    });
  }
};

// 👉 Получение публичных публикаций (без авторизации)
exports.getPublic = async (req, res) => {
  try {
    const { teacherId } = req.query;

    if (!teacherId) {
      return res.status(400).json({ message: 'Не указан teacherId.' });
    }

    const records = await ScientificPublication.findAll({
      where: { teacherId },
      order: [['publicationYear', 'DESC']],
    });

    return res.status(200).json(records);
  } catch (error) {
    console.error('❌ Ошибка при получении публичных публикаций:', error);
    return res.status(500).json({
      message: 'Ошибка при получении публикаций.',
      error: error.message,
    });
  }
};

// 👉 Обновление публикации
exports.update = async (req, res) => {
  try {
    const { id } = req.params;

    await ScientificPublication.update(
      { ...req.body, updatedAt: new Date() },
      { where: { id } }
    );

    const updated = await ScientificPublication.findByPk(id);

    if (!updated) {
      return res.status(404).json({ message: 'Публикация не найдена.' });
    }

    return res.status(200).json(updated);
  } catch (error) {
    console.error('❌ Ошибка при обновлении публикации:', error);
    return res.status(500).json({
      message: 'Ошибка при обновлении публикации.',
      error: error.message,
    });
  }
};

// 👉 Удаление публикации
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await ScientificPublication.destroy({ where: { id } });

    if (!deleted) {
      return res.status(404).json({ message: 'Публикация не найдена.' });
    }

    return res.status(200).json({ message: 'Публикация удалена.' });
  } catch (error) {
    console.error('❌ Ошибка при удалении публикации:', error);
    return res.status(500).json({
      message: 'Ошибка при удалении публикации.',
      error: error.message,
    });
  }
};

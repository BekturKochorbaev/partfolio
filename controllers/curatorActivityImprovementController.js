const CuratorActivity = require('../models/CuratorActivity');
const path = require('path');
const fs = require('fs');

// 📥 Создание
exports.create = async (req, res) => {
  try {
    const imagePaths = req.files ? req.files.map(file => `/uploads/curator/${file.filename}`) : [];

    const record = await CuratorActivity.create({
      ...req.body,
      teacherId: req.user.id,
      imagePaths,
    });

    res.status(201).json(record);
  } catch (error) {
    console.error('Ошибка при создании кураторской записи:', error);
    res.status(500).json({ message: 'Ошибка при создании.', error });
  }
};

// 📤 Получение
exports.getAll = async (req, res) => {
  try {
    const records = await CuratorActivity.findAll({
      where: { teacherId: req.query.teacherId }
    });

    res.status(200).json(records);
  } catch (error) {
    console.error('Ошибка при получении кураторских записей:', error);
    res.status(500).json({ message: 'Ошибка при получении.', error });
  }
};

// ♻️ Обновление с сохранением старых изображений
exports.update = async (req, res) => {
  try {
    let newImages = [];
    if (req.files && req.files.length > 0) {
      newImages = req.files.map(file => `/uploads/curator/${file.filename}`);
    }

    let remaining = [];
    if (req.body.existingImages) {
      try {
        remaining = JSON.parse(req.body.existingImages);
      } catch {
        remaining = [];
      }
    }

    const allImages = [...remaining, ...newImages];

    await CuratorActivity.update(
      { ...req.body, imagePaths: allImages },
      { where: { id: req.params.id } }
    );

    const updated = await CuratorActivity.findByPk(req.params.id);
    res.status(200).json(updated);
  } catch (error) {
    console.error('Ошибка при обновлении кураторской записи:', error);
    res.status(500).json({ message: 'Ошибка при обновлении.', error });
  }
};

// controllers/curatorActivityController.js
exports.getPublic = async (req, res) => {
  try {
    const { teacherId } = req.query;
    if (!teacherId) {
      return res.status(400).json({ message: "teacherId обязателен" });
    }

    const activities = await CuratorActivity.findAll({
      where: { teacherId },
      order: [["startDate", "DESC"]],
    });

    const parsed = activities.map((activity) => ({
      ...activity.dataValues,
      imagePaths: Array.isArray(activity.imagePaths)
        ? activity.imagePaths
        : (() => {
            try {
              return JSON.parse(activity.imagePaths || "[]");
            } catch {
              return [];
            }
          })(),
    }));

    return res.status(200).json(parsed);
  } catch (error) {
    console.error("❌ Ошибка при получении кураторской деятельности:", error);
    return res.status(500).json({ message: "Ошибка сервера", error: error.message });
  }
};


// ❌ Удаление
exports.remove = async (req, res) => {
  try {
    const record = await CuratorActivity.findByPk(req.params.id);

    if (record?.imagePaths?.length) {
      for (const filePath of record.imagePaths) {
        const fullPath = path.join(__dirname, '..', filePath);
        if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
      }
    }

    await CuratorActivity.destroy({ where: { id: req.params.id } });
    res.status(200).json({ message: 'Удалено успешно.' });
  } catch (error) {
    console.error('Ошибка при удалении кураторской записи:', error);
    res.status(500).json({ message: 'Ошибка при удалении.', error });
  }
};

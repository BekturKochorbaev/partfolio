const MethodicalMaterial = require('../models/MethodicalMaterial');
const fs = require('fs');
const path = require('path');

// 📥 Создание новой записи с PDF-файлами
const create = async (req, res) => {
  try {
    const { title, type, year } = req.body;
    const teacherId = req.user.id;

    const files = req.files || [];
    const savedFiles = files.map(file => `/uploads/methodical/${file.filename}`);

    const record = await MethodicalMaterial.create({
      teacherId,
      title,
      type,
      year,
      documentFiles: savedFiles,
    });

    res.status(201).json(record);
  } catch (error) {
    console.error('Ошибка при добавлении записи:', error);
    res.status(500).json({ message: 'Ошибка при добавлении записи.', error });
  }
};

// 📤 Получение всех записей преподавателя
const getAll = async (req, res) => {
  try {
    const records = await MethodicalMaterial.findAll({
      where: { teacherId: req.query.teacherId }
    });
    res.status(200).json(records);
  } catch (error) {
    console.error('Ошибка при получении записей:', error);
    res.status(500).json({ message: 'Ошибка при получении записей.', error });
  }
};

// ♻️ Обновление записи с возможной заменой файлов
const update = async (req, res) => {
  try {
    const { id } = req.params;
    const record = await MethodicalMaterial.findByPk(id);

    if (!record) {
      return res.status(404).json({ message: 'Запись не найдена.' });
    }

    let updatedFiles = record.documentFiles || [];

    // Если есть новые файлы — заменяем старые
    if (req.files && req.files.length > 0) {
      updatedFiles.forEach(filePath => {
        const fullPath = path.join(__dirname, '..', filePath);
        if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
      });

      updatedFiles = req.files.map(file => `/uploads/methodical/${file.filename}`);
    }

    // Обновляем запись
    await record.update({
      title: req.body.title,
      type: req.body.type,
      year: req.body.year,
      documentFiles: updatedFiles,
    });

    // Возвращаем обновлённую запись
    res.status(200).json(record);
  } catch (error) {
    console.error('Ошибка при обновлении записи:', error);
    res.status(500).json({ message: 'Ошибка при обновлении.', error });
  }
};

// ❌ Удаление записи и связанных файлов
const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const record = await MethodicalMaterial.findByPk(id);

    if (!record) {
      return res.status(404).json({ message: 'Запись не найдена.' });
    }

    if (Array.isArray(record.documentFiles)) {
      record.documentFiles.forEach(filePath => {
        const fullPath = path.join(__dirname, '..', filePath);
        if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
      });
    }

    await record.destroy();
    res.status(200).json({ message: 'Удалено успешно.' });
  } catch (error) {
    console.error('Ошибка при удалении записи:', error);
    res.status(500).json({ message: 'Ошибка при удалении.', error });
  }
};

// ❌ Удаление одного конкретного файла
const removeSingleFile = async (req, res) => {
  try {
    const { id, filename } = req.params;
    const record = await MethodicalMaterial.findByPk(id);

    if (!record) {
      return res.status(404).json({ message: 'Запись не найдена.' });
    }

    const fileToDelete = record.documentFiles?.find(f => f.endsWith(filename));
    if (!fileToDelete) {
      return res.status(404).json({ message: 'Файл не найден.' });
    }

    const fullPath = path.join(__dirname, '..', fileToDelete);
    if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);

    const updatedFiles = record.documentFiles.filter(f => f !== fileToDelete);
    await record.update({ documentFiles: updatedFiles });

    res.status(200).json({ message: 'Файл удалён успешно.' });
  } catch (error) {
    console.error('Ошибка при удалении файла:', error);
    res.status(500).json({ message: 'Ошибка при удалении файла.', error });
  }
};

// 🔓 Публичное получение методических материалов по teacherId
const getPublicByTeacherId = async (req, res) => {
  try {
    const { teacherId } = req.query;
    if (!teacherId) {
      return res.status(400).json({ message: "Не указан teacherId." });
    }

    const records = await MethodicalMaterial.findAll({
      where: { teacherId },
    });

    res.status(200).json(records);
  } catch (error) {
    console.error("Ошибка при получении публичных данных:", error);
    res.status(500).json({ message: "Ошибка получения данных.", error });
  }
};


module.exports = {
  create,
  getAll,
  update,
  remove,
  removeSingleFile,
  getPublicByTeacherId,
};

const QualificationImprovement = require('../models/QualificationImprovement');
const fs = require('fs');
const path = require('path');

// ✅ Создание новой записи с загрузкой файлов
exports.create = async (req, res) => {
  try {
    const { courseName, organization, completionDate } = req.body;
    const teacherId = req.user.id;

    const documentFiles = req.files ? req.files.map(file => `/uploads/qualification/${file.filename}`) : [];

    const newRecord = await QualificationImprovement.create({
      teacherId,
      courseName,
      organization,
      completionDate,
      documentFiles,
    });

    res.status(201).json(newRecord);
  } catch (error) {
    console.error('Ошибка при добавлении записи:', error);
    res.status(500).json({ message: 'Ошибка при добавлении записи.', error });
  }
};

// ✅ Получение всех записей преподавателя
exports.getAll = async (req, res) => {
  try {
    const records = await QualificationImprovement.findAll({
      where: { teacherId: req.query.teacherId }
    });
    res.status(200).json(records);
  } catch (error) {
    console.error('Ошибка при получении записей:', error);
    res.status(500).json({ message: 'Ошибка при получении записей.', error });
  }
};

// ✅ Обновление записи (с заменой файлов, если нужно)
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const record = await QualificationImprovement.findByPk(id);
    if (!record) return res.status(404).json({ message: 'Запись не найдена.' });

    let currentFiles = Array.isArray(record.documentFiles) ? record.documentFiles : [];

    // 🔄 Получаем сохранённые (неудалённые) файлы с фронтенда
    const existingFiles = req.body.existingFiles ? JSON.parse(req.body.existingFiles) : [];

    // 🗑️ Удаляем физически удалённые файлы
    const filesToDelete = currentFiles.filter(f => !existingFiles.includes(f));
    for (const filePath of filesToDelete) {
      const fullPath = path.join(__dirname, '..', filePath);
      if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
    }

    // 📥 Добавляем новые загруженные
    const newUploaded = req.files?.map(file => `/uploads/qualification/${file.filename}`) || [];

    const updatedDocumentFiles = [...existingFiles, ...newUploaded];

    await record.update({
      courseName: req.body.courseName,
      organization: req.body.organization,
      completionDate: req.body.completionDate,
      documentFiles: updatedDocumentFiles,
    });

    res.status(200).json(record);
  } catch (error) {
    console.error('Ошибка при обновлении записи:', error);
    res.status(500).json({ message: 'Ошибка при обновлении.', error });
  }
};


// ✅ Удаление всей записи вместе с файлами
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    const record = await QualificationImprovement.findByPk(id);

    if (!record) {
      return res.status(404).json({ message: 'Запись не найдена.' });
    }

    if (Array.isArray(record.documentFiles)) {
      record.documentFiles.forEach(filePath => {
        const fullPath = path.join(__dirname, '..', filePath);
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
        }
      });
    }

    await QualificationImprovement.destroy({ where: { id } });

    res.status(200).json({ message: 'Удалено успешно.' });
  } catch (error) {
    console.error('Ошибка при удалении записи:', error);
    res.status(500).json({ message: 'Ошибка при удалении.', error });
  }
};

// ✅ Удаление конкретного одного файла
exports.removeSingleFile = async (req, res) => {
  try {
    const { id, filename } = req.params;
    const record = await QualificationImprovement.findByPk(id);

    if (!record) {
      return res.status(404).json({ message: 'Запись не найдена.' });
    }

    const updatedFiles = (record.documentFiles || []).filter(filePath => !filePath.endsWith(filename));

    const filePathToDelete = (record.documentFiles || []).find(filePath => filePath.endsWith(filename));
    if (filePathToDelete) {
      const fullPath = path.join(__dirname, '..', filePathToDelete);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    }

    await QualificationImprovement.update(
      { documentFiles: updatedFiles },
      { where: { id } }
    );

    res.status(200).json({ message: 'Файл удалён успешно.' });
  } catch (error) {
    console.error('Ошибка при удалении файла:', error);
    res.status(500).json({ message: 'Ошибка при удалении файла.', error });
  }
};

exports.getPublicByTeacherId = async (req, res) => {
  try {
    const { teacherId } = req.query;
    if (!teacherId) {
      return res.status(400).json({ message: "Не указан teacherId" });
    }

    const trainings = await QualificationImprovement.findAll({
      where: { teacherId },
    });

    res.json(trainings);
  } catch (err) {
    console.error("Ошибка получения записей:", err);
    res.status(500).json({ message: "Внутренняя ошибка сервера" });
  }
};


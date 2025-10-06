const AcademicMobility = require('../models/AcademicMobility');
const fs = require('fs');
const path = require('path');

// ✅ Создание записи с файлами
exports.create = async (req, res) => {
  try {
    const { country, university, startDate, endDate, topic } = req.body;
    const teacherId = req.user.id;

    const documentFiles = req.files?.map(file => `/uploads/academic/${file.filename}`) || [];

    const newRecord = await AcademicMobility.create({
      teacherId,
      country,
      university,
      startDate,
      endDate,
      topic,
      documentFiles,
    });

    res.status(201).json(newRecord);
  } catch (error) {
    console.error('❌ Ошибка при добавлении записи:', error);
    res.status(500).json({ message: 'Ошибка при добавлении записи.', error });
  }
};

// ✅ Получение всех записей
exports.getAll = async (req, res) => {
  try {
    const records = await AcademicMobility.findAll({
      where: { teacherId: req.query.teacherId }
    });
    res.status(200).json(records);
  } catch (error) {
    console.error('❌ Ошибка при получении записей:', error);
    res.status(500).json({ message: 'Ошибка при получении записей.', error });
  }
};

// ✅ Обновление записи с заменой файлов
// ♻️ Обновление записи с учётом существующих и новых файлов
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { existingFiles } = req.body;
    const record = await AcademicMobility.findByPk(id);

    if (!record) return res.status(404).json({ message: 'Запись не найдена.' });

    // ✅ Получаем старые файлы из БД
    const currentFiles = Array.isArray(record.documentFiles) ? record.documentFiles : [];

    // ✅ Получаем оставшиеся файлы после редактирования с фронта
    const keptFiles = Array.isArray(existingFiles)
      ? existingFiles
      : (() => {
          try {
            return JSON.parse(existingFiles || "[]");
          } catch {
            return [];
          }
        })();

    // ✅ Удаляем ненужные файлы с сервера
    const filesToDelete = currentFiles.filter(f => !keptFiles.includes(f));
    for (const filePath of filesToDelete) {
      const fullPath = path.join(__dirname, '..', filePath);
      if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
    }

    // ✅ Добавляем новые загруженные файлы
    const newFiles = req.files?.map(file => `/uploads/academic/${file.filename}`) || [];

    // ✅ Обновляем запись
    const updatedData = {
      ...req.body,
      documentFiles: [...keptFiles, ...newFiles],
    };

    await record.update(updatedData);

    res.status(200).json(record);
  } catch (error) {
    console.error('❌ Ошибка при обновлении записи:', error);
    res.status(500).json({ message: 'Ошибка при обновлении.', error });
  }
};


// ✅ Удаление всей записи
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    const record = await AcademicMobility.findByPk(id);
    if (!record) return res.status(404).json({ message: 'Запись не найдена.' });

    // Удаляем файлы
    for (const filePath of record.documentFiles || []) {
      const fullPath = path.join(__dirname, '..', filePath);
      if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
    }

    await record.destroy();

    res.status(200).json({ message: 'Удалено успешно.' });
  } catch (error) {
    console.error('❌ Ошибка при удалении записи:', error);
    res.status(500).json({ message: 'Ошибка при удалении.', error });
  }
};

// ✅ Удаление одного файла из массива
exports.removeFile = async (req, res) => {
  try {
    const { id, filename } = req.params;
    const record = await AcademicMobility.findByPk(id);
    if (!record) return res.status(404).json({ message: 'Запись не найдена.' });

    const filePath = `/uploads/academic/${filename}`;
    if (!record.documentFiles.includes(filePath)) {
      return res.status(404).json({ message: 'Файл не найден в записи.' });
    }

    // Удалить физический файл
    const fullPath = path.join(__dirname, '..', filePath);
    if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);

    // Обновить в базе
    const updatedFiles = record.documentFiles.filter(f => f !== filePath);
    await record.update({ documentFiles: updatedFiles });

    res.status(200).json({ message: 'Файл успешно удалён.' });
  } catch (error) {
    console.error('❌ Ошибка при удалении файла:', error);
    res.status(500).json({ message: 'Ошибка при удалении файла.', error });
  }
};

// Получение записей академической мобильности без авторизации (для публичного профиля)
exports.getPublicByTeacherId = async (req, res) => {
  try {
    const { teacherId } = req.query;
    if (!teacherId) {
      return res.status(400).json({ error: "teacherId is required" });
    }

    const records = await AcademicMobility.findAll({
      where: { teacherId },
    });

    res.json(records);
  } catch (error) {
    console.error("Ошибка получения академической мобильности:", error);
    res.status(500).json({ error: "Ошибка сервера" });
  }
};


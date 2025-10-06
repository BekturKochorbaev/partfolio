const fs = require("fs");
const path = require("path");
const PublishedTextbook = require("../models/PublishedTextbook");

// 📥 Создание новой записи с файлами
exports.create = async (req, res) => {
  try {
    const { title, coAuthors, moeTitle, year, publisher, isbn } = req.body;

    const fileUrls = req.files?.map(file => `/uploads/textbooks/${file.filename}`) || [];

    const newRecord = await PublishedTextbook.create({
      teacherId: req.user.id, // ✅ получаем teacherId из токена
      title,
      coAuthors,
      moeTitle, // ✅ новое поле
      year,
      publisher,
      isbn,
      files: fileUrls,
    });

    res.status(201).json(newRecord);
  } catch (error) {
    console.error("Ошибка при создании:", error);
    res.status(500).json({ message: "Ошибка при создании записи.", error });
  }
};

// 📤 Получение всех записей по teacherId
exports.getAll = async (req, res) => {
  try {
    const records = await PublishedTextbook.findAll({
      where: { teacherId: req.user.id },
    });
    res.status(200).json(records);
  } catch (error) {
    console.error("Ошибка при получении:", error);
    res.status(500).json({ message: "Ошибка при получении записей.", error });
  }
};

// ♻️ Обновление записи + добавление новых файлов
exports.update = async (req, res) => {
  try {
    const textbook = await PublishedTextbook.findByPk(req.params.id);
    if (!textbook) return res.status(404).json({ message: "Запись не найдена." });

    const { title, coAuthors, moeTitle, year, publisher, isbn } = req.body;
    const newFiles = req.files?.map(file => `/uploads/textbooks/${file.filename}`) || [];
    const updatedFiles = [...(textbook.files || []), ...newFiles];

    await textbook.update({
      title,
      coAuthors,
      moeTitle, // ✅ новое поле
      year,
      publisher,
      isbn,
      files: updatedFiles,
    });

    res.status(200).json({ message: "Обновлено успешно.", textbook });
  } catch (error) {
    console.error("Ошибка при обновлении:", error);
    res.status(500).json({ message: "Ошибка при обновлении.", error });
  }
};

// ❌ Удаление всей записи + файлов
exports.remove = async (req, res) => {
  try {
    const textbook = await PublishedTextbook.findByPk(req.params.id);
    if (!textbook) return res.status(404).json({ message: "Запись не найдена." });

    textbook.files?.forEach(filePath => {
      const fullPath = path.join(__dirname, "..", filePath);
      if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
    });

    await textbook.destroy();

    res.status(200).json({ message: "Удалено успешно." });
  } catch (error) {
    console.error("Ошибка при удалении:", error);
    res.status(500).json({ message: "Ошибка при удалении.", error });
  }
};

// ❌ Удаление одного файла из массива
exports.removeFile = async (req, res) => {
  try {
    const { id, filename } = req.params;

    const textbook = await PublishedTextbook.findByPk(id);
    if (!textbook) return res.status(404).json({ message: "Запись не найдена." });

    const updatedFiles = (textbook.files || []).filter(file => !file.includes(filename));

    const filePath = path.join(__dirname, "..", "uploads", "textbooks", filename);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    await textbook.update({ files: updatedFiles });

    res.status(200).json({ message: "Файл удалён." });
  } catch (error) {
    console.error("Ошибка при удалении файла:", error);
    res.status(500).json({ message: "Ошибка при удалении файла.", error });
  }
};

// 🌐 Публичный доступ по teacherId
exports.getAllPublic = async (req, res) => {
  try {
    const { teacherId } = req.query;
    if (!teacherId) {
      return res.status(400).json({ message: "Не указан teacherId." });
    }

    const records = await PublishedTextbook.findAll({
      where: { teacherId },
    });

    res.status(200).json(records);
  } catch (error) {
    console.error("Ошибка при получении публичных данных:", error);
    res.status(500).json({ message: "Ошибка при получении данных.", error });
  }
};

const fs = require("fs");
const path = require("path");
const ExpertActivity = require("../models/ExpertActivity");

// 📥 Создание новой записи
exports.create = async (req, res) => {
  try {
    const teacherId = req.user.id;

    const imageUrls = req.files?.map(file => `/uploads/experts/${file.filename}`) || [];

    const newRecord = await ExpertActivity.create({
      teacherId,
      competitionName: req.body.competitionName,
      role: req.body.role,
      participationDate: req.body.participationDate,
      organizer: req.body.organizer,
      images: imageUrls,
    });

    res.status(201).json(newRecord);
  } catch (error) {
    console.error("❌ Ошибка при создании:", error);
    res.status(500).json({ message: "Ошибка при создании записи.", error });
  }
};

// 📤 Получение всех записей по teacherId
exports.getAll = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const records = await ExpertActivity.findAll({ where: { teacherId } });
    res.status(200).json(records);
  } catch (error) {
    console.error("❌ Ошибка при получении:", error);
    res.status(500).json({ message: "Ошибка при получении записей.", error });
  }
};

// ♻️ Обновление записи
exports.update = async (req, res) => {
  try {
    const record = await ExpertActivity.findByPk(req.params.id);
    if (!record) return res.status(404).json({ message: "Запись не найдена." });

    const existingFiles = JSON.parse(req.body.existingFiles || "[]");
    const newImages = req.files?.map(file => `/uploads/experts/${file.filename}`) || [];
    const updatedImages = [...existingFiles, ...newImages];

    await record.update({
      competitionName: req.body.competitionName,
      role: req.body.role,
      participationDate: req.body.participationDate,
      organizer: req.body.organizer,
      images: updatedImages,
    });

    res.status(200).json({ message: "Обновлено успешно", record });
  } catch (error) {
    console.error("❌ Ошибка при обновлении:", error);
    res.status(500).json({ message: "Ошибка при обновлении.", error });
  }
};

// 🗑️ Удаление всей записи и её изображений
exports.remove = async (req, res) => {
  try {
    const record = await ExpertActivity.findByPk(req.params.id);
    if (!record) return res.status(404).json({ message: "Запись не найдена." });

    record.images?.forEach((imgPath) => {
      const fullPath = path.join(__dirname, "..", imgPath);
      if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
    });

    await record.destroy();
    res.status(200).json({ message: "Удалено успешно." });
  } catch (error) {
    console.error("❌ Ошибка при удалении:", error);
    res.status(500).json({ message: "Ошибка при удалении.", error });
  }
};

// 🖼️ Удаление одного изображения
exports.removeImage = async (req, res) => {
  try {
    const { id, filename } = req.params;
    const record = await ExpertActivity.findByPk(id);
    if (!record) return res.status(404).json({ message: "Запись не найдена." });

    const updatedImages = (record.images || []).filter(img => !img.includes(filename));
    const filePath = path.join(__dirname, "..", "uploads", "experts", filename);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    await record.update({ images: updatedImages });
    res.status(200).json({ message: "Изображение удалено." });
  } catch (error) {
    console.error("❌ Ошибка при удалении изображения:", error);
    res.status(500).json({ message: "Ошибка при удалении изображения.", error });
  }
};

// 📤 Публичное получение по teacherId (для публичного профиля)
exports.getPublicByTeacherId = async (req, res) => {
  try {
    const { teacherId } = req.query;
    if (!teacherId) {
      return res.status(400).json({ error: "teacherId обязателен" });
    }

    const records = await ExpertActivity.findAll({
      where: { teacherId }
    });

    res.status(200).json(records);
  } catch (err) {
    console.error("❌ Ошибка получения публичных данных:", err);
    res.status(500).json({ error: "Ошибка сервера" });
  }
};


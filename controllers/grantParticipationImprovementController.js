const fs = require("fs");
const path = require("path");
const GrantParticipation = require("../models/GrantParticipation");

// 📥 СОЗДАНИЕ новой записи
exports.create = async (req, res) => {
  try {
    const {
      projectName,
      role,
      organization,
      startDate,
      endDate,
      status,
    } = req.body;

    const teacherId = req.user.id; // из токена

    const imageUrls = req.files?.map(file => `/uploads/grants/${file.filename}`) || [];

    const newRecord = await GrantParticipation.create({
      teacherId,
      projectName,
      role,
      organization,
      startDate,
      endDate,
      status,
      images: imageUrls,
    });

    res.status(201).json(newRecord);
  } catch (error) {
    console.error("❌ Ошибка при создании:", error);
    res.status(500).json({ message: "Ошибка при создании записи.", error });
  }
};

// 📤 ПОЛУЧЕНИЕ всех записей по teacherId
// 📤 ПОЛУЧЕНИЕ всех записей по teacherId из токена
exports.getAll = async (req, res) => {
  try {
    const teacherId = req.user.id; // получаем из токена
    const records = await GrantParticipation.findAll({
      where: { teacherId },
    });
    res.status(200).json(records);
  } catch (error) {
    console.error("❌ Ошибка при получении:", error);
    res.status(500).json({ message: "Ошибка при получении записей.", error });
  }
};


// ♻️ ОБНОВЛЕНИЕ записи
exports.update = async (req, res) => {
  try {
    const grant = await GrantParticipation.findByPk(req.params.id);
    if (!grant) return res.status(404).json({ message: "Запись не найдена." });

    // Существующие файлы (JSON строка → массив)
    const existingFiles = JSON.parse(req.body.existingFiles || "[]");

    // Новые изображения
    const newImages = req.files?.map(file => `/uploads/grants/${file.filename}`) || [];

    const updatedImages = [...existingFiles, ...newImages];

    await grant.update({
      projectName: req.body.projectName,
      role: req.body.role,
      organization: req.body.organization,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      status: req.body.status,
      images: updatedImages,
    });

    res.status(200).json({ message: "Обновлено успешно", grant });
  } catch (error) {
    console.error("❌ Ошибка при обновлении:", error);
    res.status(500).json({ message: "Ошибка при обновлении.", error });
  }
};

// 🗑️ УДАЛЕНИЕ всей записи + файлов
exports.remove = async (req, res) => {
  try {
    const grant = await GrantParticipation.findByPk(req.params.id);
    if (!grant) return res.status(404).json({ message: "Запись не найдена." });

    grant.images?.forEach((imagePath) => {
      const fullPath = path.join(__dirname, "..", imagePath);
      if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
    });

    await grant.destroy();
    res.status(200).json({ message: "Удалено успешно." });
  } catch (error) {
    console.error("❌ Ошибка при удалении:", error);
    res.status(500).json({ message: "Ошибка при удалении.", error });
  }
};

// 🖼️ УДАЛЕНИЕ одного изображения
exports.removeImage = async (req, res) => {
  try {
    const { id, filename } = req.params;
    const grant = await GrantParticipation.findByPk(id);
    if (!grant) return res.status(404).json({ message: "Запись не найдена." });

    const updatedImages = (grant.images || []).filter(img => !img.includes(filename));
    const filePath = path.join(__dirname, "..", "uploads", "grants", filename);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    await grant.update({ images: updatedImages });
    res.status(200).json({ message: "Изображение удалено." });
  } catch (error) {
    console.error("❌ Ошибка при удалении изображения:", error);
    res.status(500).json({ message: "Ошибка при удалении изображения.", error });
  }
};

// Публичный доступ по teacherId
exports.getAllPublic = async (req, res) => {
  try {
    const { teacherId } = req.query;
    if (!teacherId) {
      return res.status(400).json({ message: "Не указан teacherId." });
    }

    const records = await GrantParticipation.findAll({
      where: { teacherId },
    });

    res.status(200).json(records);
  } catch (error) {
    console.error("Ошибка при получении публичных данных:", error);
    res.status(500).json({ message: "Ошибка при получении данных.", error });
  }
};

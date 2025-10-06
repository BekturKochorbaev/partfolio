const fs = require("fs");
const path = require("path");
const TeacherAchievement = require("../models/TeacherAchievement");

// 🔹 Получить все достижения преподавателя (либо по токену, либо по ?teacherId=...)
exports.getAllAchievements = async (req, res) => {
  try {
    const teacherId = req.query.teacherId || req.user?.id;
    if (!teacherId) {
      return res.status(400).json({ message: "Не указан teacherId" });
    }

    const achievements = await TeacherAchievement.findAll({
      where: { teacherId },
      order: [["createdAt", "DESC"]],
    });
    res.json(achievements);
  } catch (error) {
    console.error("Ошибка при получении достижений:", error);
    res.status(500).json({ message: "Ошибка получения достижений" });
  }
};

// 🔹 Создать новое достижение с множеством изображений
exports.createAchievement = async (req, res) => {
  try {
    const { title, description, date } = req.body;
    const files = req.files || [];

    if (!title || title.trim() === "") {
      return res.status(400).json({ message: "Поле 'Название' обязательно" });
    }

    const filenames = files.map((file) => file.filename);

    const achievement = await TeacherAchievement.create({
      title: title.trim(),
      description: description?.trim() || "",
      date: date || null,
      images: JSON.stringify(filenames),
      teacherId: req.user.id,
    });

    res.status(201).json(achievement);
  } catch (error) {
    console.error("Ошибка при создании достижения:", error);
    res.status(500).json({ message: "Ошибка создания достижения", error: error.message });
  }
};

// 🔹 Обновить достижение с заменой изображений
exports.updateAchievement = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, date } = req.body;
    const newFiles = req.files || [];

    const achievement = await TeacherAchievement.findOne({
      where: { id, teacherId: req.user.id },
    });

    if (!achievement) {
      return res.status(404).json({ message: "Достижение не найдено" });
    }

    if (newFiles.length && achievement.images) {
      const oldFilenames = JSON.parse(achievement.images);
      oldFilenames.forEach((filename) => {
        const filePath = path.join(__dirname, "../uploads/achievements", filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
    }

    const newFilenames = newFiles.map((file) => file.filename);

    await achievement.update({
      title: title?.trim() || achievement.title,
      description: description?.trim() || achievement.description,
      date: date || achievement.date,
      images: newFiles.length ? JSON.stringify(newFilenames) : achievement.images,
    });

    res.json(achievement);
  } catch (error) {
    console.error("Ошибка при обновлении достижения:", error);
    res.status(500).json({ message: "Ошибка обновления достижения" });
  }
};

// 🔹 Удалить достижение и изображения
exports.deleteAchievement = async (req, res) => {
  try {
    const { id } = req.params;

    const achievement = await TeacherAchievement.findOne({
      where: { id, teacherId: req.user.id },
    });

    if (!achievement) {
      return res.status(404).json({ message: "Достижение не найдено" });
    }

    if (achievement.images) {
      const filenames = JSON.parse(achievement.images);
      filenames.forEach((filename) => {
        const imagePath = path.join(__dirname, "../uploads/achievements", filename);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      });
    }

    await achievement.destroy();
    res.json({ message: "✅ Достижение и изображения удалены" });
  } catch (error) {
    console.error("Ошибка при удалении достижения:", error);
    res.status(500).json({ message: "Ошибка удаления достижения" });
  }
};

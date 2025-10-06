// controllers/galleryController.js
const { Gallery } = require('../models'); // ✅ ПРАВИЛЬНО
console.log("📝 getAllMedia controller вызван");
exports.getAllMedia = async (req, res) => {
  try {
    const teacherId = req.query.teacherId || req.user?.id;

    if (!teacherId) {
      console.warn("⛔ teacherId не указан и не найден в токене");
      return res.status(403).json({ message: "Нет доступа: teacherId отсутствует" });
    }

    console.log("📥 Получение медиа для teacherId:", teacherId);

    const media = await Gallery.findAll({ where: { teacherId } });
    res.json(media);
  } catch (err) {
    console.error("❌ Ошибка при получении медиа:", err);
    res.status(500).json({ message: 'Ошибка при получении медиа', error: err });
  }
};

exports.uploadMedia = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Файл не загружен' });
    }

    const teacherId = req.user?.id;

    if (!teacherId) {
      console.warn("⛔ Отсутствует req.user.id при загрузке");
      return res.status(403).json({ message: "Нет доступа" });
    }

    const isImage = req.file.mimetype.startsWith("image");
    const fileType = isImage ? "image" : "video";
    const fileUrl = `/uploads/${fileType === 'image' ? 'images' : 'videos'}/${req.file.filename}`;

    const media = await Gallery.create({
      teacherId,
      title: req.file.originalname,
      description: "",
      fileType,
      fileUrl,
    });

    console.log("✅ Медиа успешно загружено:", media);
    res.status(201).json(media);
  } catch (err) {
    console.error("❌ Ошибка загрузки медиа:", err);
    res.status(500).json({ message: 'Ошибка при загрузке', error: err });
  }
};

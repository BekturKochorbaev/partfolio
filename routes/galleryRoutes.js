const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { upload } = require("../utils/uploadConfig");
const { authenticateToken } = require('../middleware/authMiddleware');
const { Op } = require("sequelize");
const galleryController = require('../controllers/galleryController');
const { Gallery } = require('../models');

// 📤 Загрузка медиафайла
router.post(
  '/upload',
  authenticateToken,
  upload.single('file'),
  galleryController.uploadMedia
);

// ❌ Удаление медиафайла
router.delete('/:filename', authenticateToken, async (req, res) => {
  const { filename } = req.params;

  const possiblePaths = [
    path.join(__dirname, '../uploads/images', filename),
    path.join(__dirname, '../uploads/videos', filename),
  ];

  const filePath = possiblePaths.find(fs.existsSync);

  if (!filePath) {
    console.warn("⚠️ Файл не найден:", filename);
    return res.status(404).json({ message: 'Файл не найден' });
  }

  try {
    fs.unlinkSync(filePath);

    await Gallery.destroy({
      where: {
        fileUrl: {
          [Op.like]: `%${filename}`
        }
      }
    });

    console.log("🗑️ Файл удалён:", filename);
    res.json({ message: '✅ Файл удалён' });
  } catch (err) {
    console.error("❌ Ошибка при удалении файла:", err);
    res.status(500).json({
      message: 'Ошибка при удалении',
      error: err.message
    });
  }
});

// 📥 Получение всех медиафайлов
router.get('/', authenticateToken, galleryController.getAllMedia);

// 🔓 Публичный доступ
router.get('/public', galleryController.getAllMedia);

module.exports = router;

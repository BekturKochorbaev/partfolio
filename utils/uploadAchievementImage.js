const multer = require('multer');
const path = require('path');
const fs = require('fs');

// ✅ Убедимся, что папка существует
const uploadDir = path.join(__dirname, '..', 'uploads', 'achievements');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ✅ Настройки хранилища
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); // путь для сохранения
  },
  filename: function (req, file, cb) {
    // безопасное уникальное имя файла
    const safeName = Date.now() + '-' + file.originalname.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9.\-_]/g, '');
    cb(null, safeName);
  },
});

// ✅ Конфигурация multer
const uploadAchievementImage = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("❌ Только изображения (jpeg, png, webp) разрешены"));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // максимум 5 МБ
  },
});

module.exports = uploadAchievementImage;

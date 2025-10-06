const multer = require('multer');
const path = require('path');
const fs = require('fs');

// ✅ Убедимся, что папка существует
const uploadDir = path.join(__dirname, '..', 'uploads', 'academic');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ✅ Настройка хранилища
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  },
});

// ✅ Фильтрация файлов (только изображения)
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('⛔ Разрешены только изображения: .jpg, .jpeg, .png'), false);
  }
};

// ✅ Экспорт multer
const uploadAcademic = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // максимум 10MB на файл
});

module.exports = uploadAcademic;

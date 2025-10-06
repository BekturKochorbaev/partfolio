const multer = require('multer');
const path = require('path');

// Указываем папку для сохранения
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/textbooks'); // 📁 путь, где будут храниться файлы
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, filename);
  },
});

// Фильтрация только PDF
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Только PDF файлы разрешены'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // макс. 10 МБ на файл
});

module.exports = upload;

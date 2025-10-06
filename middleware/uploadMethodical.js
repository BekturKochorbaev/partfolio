const multer = require('multer');
const path = require('path');

// Настройка хранения файлов
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/methodical/'); // папка для методических материалов
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// Фильтрация файлов: только PDF
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['application/pdf'];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Только PDF-файлы разрешены.'));
  }
};

// Готовое middleware для загрузки массива PDF-файлов (до 10)
const uploadMethodical = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
  }
}).array('documents', 10);

module.exports = uploadMethodical;

const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Папка для сохранения сертификатов повышения квалификации
const uploadFolder = path.join(__dirname, '..', 'uploads', 'qualification');

// Проверяем наличие папки, если нет — создаём
if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder, { recursive: true });
}

// Настройка хранилища Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadFolder);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

// Фильтр допустимых файлов
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeType = allowedTypes.test(file.mimetype);

  if (extName && mimeType) {
    cb(null, true);
  } else {
    cb(new Error('Можно загружать только файлы .jpeg, .jpg, .png!'));
  }
};

// Ограничения по размеру файлов (например, 5MB)
const limits = {
  fileSize: 5 * 1024 * 1024, // 5MB
};

// ⚠️ Экспортируем сам multer-инстанс, а не middleware
module.exports = multer({ storage, fileFilter, limits });

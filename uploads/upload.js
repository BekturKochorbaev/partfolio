const multer = require('multer');
const path = require('path');

// Указываем хранилище
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // папка uploads в корне
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  },
});

// Фильтрация файлов
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|mp4|mov|avi/;
  const ext = path.extname(file.originalname).toLowerCase();
  const isValid = allowedTypes.test(ext);

  if (isValid) {
    cb(null, true);
  } else {
    cb(new Error('Неподдерживаемый формат файла'));
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;

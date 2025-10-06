const multer = require("multer");
const path = require("path");

// Указываем хранилище для изображений экспертов
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/experts"); // Папка для хранения
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  },
});

// Фильтрация допустимых типов изображений
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const ext = path.extname(file.originalname).toLowerCase();
  const isValid = allowedTypes.test(ext);
  if (isValid) {
    cb(null, true);
  } else {
    cb(new Error("Неподдерживаемый формат изображения"));
  }
};

const uploadExperts = multer({ storage, fileFilter });

module.exports = uploadExperts;

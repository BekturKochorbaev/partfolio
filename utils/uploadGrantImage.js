const multer = require("multer");
const path = require("path");
const fs = require("fs");

// 📁 Папка для загрузки
const uploadPath = path.join(__dirname, "..", "uploads", "grants");

// 🛠 Создание папки при необходимости
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// ⚙️ Настройки хранилища
const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadPath),
  filename: (_, file, cb) => {
    const timestamp = Date.now();
    const safeName = file.originalname.replace(/\s+/g, "_");
    cb(null, `${timestamp}-${safeName}`);
  },
});

// 📂 Фильтрация допустимых форматов
const fileFilter = (_, file, cb) => {
  const allowed = /\.(jpg|jpeg|png|webp)$/i;
  if (allowed.test(file.originalname)) {
    cb(null, true);
  } else {
    cb(new Error("⛔ Допустимы только изображения: JPG, JPEG, PNG, WEBP"));
  }
};

module.exports = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

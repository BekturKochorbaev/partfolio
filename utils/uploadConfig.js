const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 📁 Пути к папкам
const UPLOAD_DIR = path.join(__dirname, '..', 'uploads');
const IMAGE_DIR = path.join(UPLOAD_DIR, 'images');
const VIDEO_DIR = path.join(UPLOAD_DIR, 'videos');
const DIPLOMA_DIR = path.join(UPLOAD_DIR, 'diplomas');
const AVATAR_DIR = path.join(UPLOAD_DIR, 'avatars');
const OTHER_DIR = path.join(UPLOAD_DIR, 'others');

// 📁 Создание папок
const createUploadFolders = () => {
  [IMAGE_DIR, VIDEO_DIR, DIPLOMA_DIR, AVATAR_DIR, OTHER_DIR].forEach((dir) => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  });
};
createUploadFolders();

// 🎯 Фильтр допустимых типов
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/jpg',
    'video/mp4',
    'application/pdf',
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Неподдерживаемый тип файла'), false);
  }
};

// 🗂 Хранилище по типу файла
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const mimetype = file.mimetype;
    let uploadPath = OTHER_DIR;

    if (mimetype.startsWith('image')) {
      uploadPath = IMAGE_DIR;
    } else if (mimetype.startsWith('video')) {
      uploadPath = VIDEO_DIR;
    }

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  },
});

// 📄 Хранилище только для дипломов
const diplomaStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIPLOMA_DIR);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `diploma-${Date.now()}${ext}`;
    cb(null, uniqueName);
  },
});

// 👤 Хранилище только для аватаров
const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, AVATAR_DIR);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `avatar-${Date.now()}${ext}`;
    cb(null, uniqueName);
  },
});

// 📦 Экспорт конфигурации
const upload = multer({ storage, fileFilter });
const uploadDiploma = multer({ storage: diplomaStorage, fileFilter });
const uploadAvatar = multer({ storage: avatarStorage, fileFilter });

module.exports = {
  upload,
  uploadDiploma,
  uploadAvatar,
};

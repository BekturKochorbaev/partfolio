// ✅ utils/uploadCurator.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const dir = './uploads/curator';
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + '-' + Math.round(Math.random() * 1e9) + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if ([".jpg", ".jpeg", ".png"].includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Только изображения (JPG, PNG)"));
  }
};

const uploadCurator = multer({ storage, fileFilter });

module.exports = uploadCurator;

const express = require('express');
const router = express.Router();
const curatorActivityController = require('../controllers/curatorActivityImprovementController');
const { authenticateToken } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Папка для загрузки изображений
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'uploads/curator';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.test(ext)) cb(null, true);
    else cb(new Error('Неподдерживаемый формат изображения'));
  }
});

// ✅ Правильное использование контроллера
router.get("/", curatorActivityController.getAll); // приватный
router.get("/public", curatorActivityController.getPublic); // публичный
router.post('/', authenticateToken, upload.array('images'), curatorActivityController.create);
router.put('/:id', authenticateToken, upload.array('images'), curatorActivityController.update);
router.delete('/:id', authenticateToken, curatorActivityController.remove);


module.exports = router;

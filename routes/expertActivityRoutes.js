const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const expertActivityController = require('../controllers/expertActivityImprovementController');
const { authenticateToken } = require('../middleware/authMiddleware');
const uploadExperts = require('../utils/uploadExperts');

// 🗂 Хранилище (если uploadExperts не используется где-то отдельно)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/experts');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

// 🔐 Защищённые маршруты
router.post('/', authenticateToken, uploadExperts.array('images'), expertActivityController.create);
router.get('/', authenticateToken, expertActivityController.getAll);
router.put('/:id', authenticateToken, upload.array('images'), expertActivityController.update);
router.delete('/:id', authenticateToken, expertActivityController.remove);
router.delete('/:id/image/:filename', authenticateToken, expertActivityController.removeImage);

// 🌐 Публичный маршрут для просмотра на публичной странице профиля
router.get('/public', expertActivityController.getPublicByTeacherId);

module.exports = router;

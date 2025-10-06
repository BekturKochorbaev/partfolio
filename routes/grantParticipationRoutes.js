const express = require('express');
const router = express.Router();

const grantController = require('../controllers/grantParticipationImprovementController');
const upload = require('../utils/uploadGrantImage');
const { authenticateToken } = require('../middleware/authMiddleware');

// 📥 Создание новой записи с изображениями
router.post(
  '/',
  authenticateToken,
  upload.array('images'),
  grantController.create
);

// 📤 Получение всех записей по teacherId (по токену)
router.get(
  '/',
  authenticateToken,
  grantController.getAll
);

// 🌐 Публичный маршрут для отображения в профиле преподавателя
router.get(
  '/public',
  grantController.getAllPublic
);

// ♻️ Обновление записи + добавление изображений
router.put(
  '/:id',
  authenticateToken,
  upload.array('images'),
  grantController.update
);

// ❌ Удаление всей записи + изображений
router.delete(
  '/:id',
  authenticateToken,
  grantController.remove
);

// ❌ Удаление одного изображения
router.delete(
  '/:id/image/:filename',
  authenticateToken,
  grantController.removeImage
);

module.exports = router;

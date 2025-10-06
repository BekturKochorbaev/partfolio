const express = require('express');
const router = express.Router();
const academicMobilityController = require('../controllers/academicMobilityController');
const { authenticateToken } = require('../middleware/authMiddleware');
const uploadAcademic = require('../utils/uploadAcademic');

// Удаление одного файла
router.delete('/:id/files/:filename', authenticateToken, academicMobilityController.removeFile);
// Публичный маршрут для получения академической мобильности по teacherId
router.get('/public', academicMobilityController.getPublicByTeacherId);


// Создание записи с несколькими файлами
router.post(
  '/',
  authenticateToken,
  uploadAcademic.array('documents', 5),
  academicMobilityController.create
);

// Получение всех записей
router.get('/', authenticateToken, academicMobilityController.getAll);

// ✅ Обновление также поддерживает несколько файлов
router.put(
  '/:id',
  authenticateToken,
  uploadAcademic.array('documents', 5),
  academicMobilityController.update
);

// Удаление всей записи
router.delete('/:id', authenticateToken, academicMobilityController.remove);

module.exports = router;

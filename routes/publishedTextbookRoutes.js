const express = require('express');
const router = express.Router();
const {
  create,
  getAll,
  update,
  remove,
  removeFile,
  getAllPublic, // ✅ добавили
} = require('../controllers/publishedTextbookImprovementController');
const upload = require('../utils/uploadTextbook');
const { authenticateToken } = require('../middleware/authMiddleware');

// 📥 Создание новой записи с PDF-файлами
router.post(
  '/',
  authenticateToken,
  upload.array('files'),
  create
);

// 📤 Получение всех записей по teacherId
router.get('/', authenticateToken, getAll);

// ✅ Публичный маршрут для отображения при поиске
router.get('/public', getAllPublic);

// ♻️ Обновление записи + добавление новых PDF
router.put(
  '/:id',
  authenticateToken,
  upload.array('files'),
  update
);

// ❌ Удаление всей записи + файлов с сервера
router.delete('/:id', authenticateToken, remove);

// ❌ Удаление одного конкретного файла
router.delete(
  '/:id/file/:filename',
  authenticateToken,
  removeFile
);

module.exports = router;

const express = require('express');
const router = express.Router();
const methodicalMaterialController = require('../controllers/methodicalMaterialController');
const { authenticateToken } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMethodical'); // УЖЕ .array внутри

console.log("✅ upload:", typeof upload);
console.log("✅ authenticateToken:", typeof authenticateToken);
console.log("✅ create:", typeof methodicalMaterialController.create);
router.get("/public", methodicalMaterialController.getPublicByTeacherId);


// 📥 Создание записи с PDF-файлами
router.post(
  '/',
  authenticateToken,
  upload, // ⚠️ УБРАНО .array
  methodicalMaterialController.create
);

// 📤 Получение всех записей
router.get(
  '/',
  authenticateToken,
  methodicalMaterialController.getAll
);

// ♻️ Обновление записи с возможной заменой файлов
router.put(
  '/:id',
  authenticateToken,
  upload, // ⚠️ УБРАНО .array
  methodicalMaterialController.update
);

// ❌ Удаление всей записи
router.delete(
  '/:id',
  authenticateToken,
  methodicalMaterialController.remove
);

// ❌ Удаление одного конкретного PDF-файла
router.delete(
  '/:id/files/:filename',
  authenticateToken,
  methodicalMaterialController.removeSingleFile
);


module.exports = router;

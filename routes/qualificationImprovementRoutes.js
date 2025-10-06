const express = require('express');
const router = express.Router();
const qualificationImprovementController = require('../controllers/qualificationImprovementController');
const { authenticateToken } = require('../middleware/authMiddleware');
const uploadQualification = require('../middleware/uploadQualification');

// 📋 Маршруты
router.post(
  '/',
  authenticateToken,
  uploadQualification.array('documents', 10),
  qualificationImprovementController.create
);

router.get(
  '/',
  authenticateToken,
  qualificationImprovementController.getAll
);

router.put(
  '/:id',
  authenticateToken,
  uploadQualification.array('documents', 10),
  qualificationImprovementController.update
);

router.delete(
  '/:id',
  authenticateToken,
  qualificationImprovementController.remove
);

router.delete(
  '/:id/files/:filename',
  authenticateToken,
  qualificationImprovementController.removeSingleFile
);

router.get("/public", qualificationImprovementController.getPublicByTeacherId);

module.exports = router;

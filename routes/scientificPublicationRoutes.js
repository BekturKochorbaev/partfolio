const express = require('express');
const router = express.Router();
const scientificPublicationController = require('../controllers/scientificPublicationController');
const { authenticateToken } = require('../middleware/authMiddleware');

// 🛡 Защищённые маршруты
router.post('/', authenticateToken, scientificPublicationController.create);
router.get('/', scientificPublicationController.getAll);
router.put('/:id', authenticateToken, scientificPublicationController.update);
router.delete('/:id', authenticateToken, scientificPublicationController.remove);

// 🌐 Публичный маршрут
router.get('/public', scientificPublicationController.getPublic);

module.exports = router;

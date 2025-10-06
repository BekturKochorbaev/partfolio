// 📂 routes/searchRoutes.js

const express = require('express');
const { searchTeachers } = require('../controllers/searchController');

const router = express.Router();

// 🔍 Используем готовый контроллер
router.get('/teachers', searchTeachers);

module.exports = router;

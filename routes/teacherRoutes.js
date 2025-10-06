const express = require('express');
const router = express.Router();

// ⬅️ ИМЕННО так — с деструктуризацией
const { searchTeachers } = require('../controllers/teacherController');

router.get('/search', searchTeachers);

module.exports = router;

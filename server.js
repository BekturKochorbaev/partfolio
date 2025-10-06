const express = require('express');
const multer = require('multer');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const sequelize = require('./config/database');
const sitemapRoutes = require('./routes/sitemapRoutes');

dotenv.config();

const app = express();

// ✅ Настройка CORS
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.options('*', cors());

// ✅ Поддержка JSON и form-urlencoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Статические файлы
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads/profile', express.static(path.join(__dirname, 'uploads/profile')));
app.use('/uploads/images', express.static(path.join(__dirname, 'uploads/images')));
app.use('/uploads/videos', express.static(path.join(__dirname, 'uploads/videos')));
app.use('/uploads/diplomas', express.static(path.join(__dirname, 'uploads/diplomas')));
app.use('/uploads/achievements', express.static(path.join(__dirname, 'uploads/achievements')));
app.use('/uploads/avatars', express.static(path.join(__dirname, 'uploads/avatars')));
app.use('/uploads/textbooks', express.static(path.join(__dirname, 'uploads/textbooks')));
app.use('/uploads/grants', express.static(path.join(__dirname, 'uploads/grants')));
app.use('/uploads/experts', express.static(path.join(__dirname, 'uploads/experts')));

// ✅ Импорт роутов
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const personalInfoRoutes = require('./routes/personalInfoRoutes');
const teachingRoutes = require('./routes/teachingRoutes');
const studentAchievementRoutes = require('./routes/studentAchievementRoutes');
const teacherAchievementRoutes = require('./routes/teacherAchievementRoutes');
const studentMentorshipRoutes = require('./routes/studentMentorshipRoutes');
const professionalActivityRoutes = require('./routes/professionalActivityRoutes');
const galleryRoutes = require('./routes/galleryRoutes');
const diplomaRoutes = require('./routes/diplomaRoutes');
const userRoutes = require('./routes/userRoutes');
const searchRoutes = require('./routes/searchRoutes');
const teacherRoutes = require('./routes/teacherRoutes'); // ✅ добавлено
const academicMobilityRoutes = require('./routes/academicMobilityRoutes');
const qualificationImprovementRoutes = require('./routes/qualificationImprovementRoutes');
const methodicalRoutes = require('./routes/methodicalMaterialRoutes');
const publishedTextbookRoutes = require('./routes/publishedTextbookRoutes');
const scientificPublicationRoutes = require('./routes/scientificPublicationRoutes');
const grantParticipationRoutes = require('./routes/grantParticipationRoutes');
const curatorActivityRoutes = require('./routes/curatorActivityRoutes');
const expertActivityRoutes = require('./routes/expertActivityRoutes');
const ratingRoutes = require("./routes/rating");

// ✅ Sitemap
app.use('/', sitemapRoutes);

// ✅ Применение роутов
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/personal-info', personalInfoRoutes);
app.use('/api/teaching', teachingRoutes);
app.use('/api/student-achievements', studentAchievementRoutes);
app.use('/api/teacher-achievements', teacherAchievementRoutes);
app.use('/api/student-mentorship', studentMentorshipRoutes);
app.use('/api/professional-activity', professionalActivityRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/diploma', diplomaRoutes);
app.use('/api/users', userRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/teachers', teacherRoutes); // ✅ подключено сюда
app.use('/api/academic-mobility', academicMobilityRoutes);
app.use('/api/qualification-improvement', qualificationImprovementRoutes);
app.use('/api/methodical-materials', methodicalRoutes);
app.use('/api/published-textbook', publishedTextbookRoutes);
app.use('/api/scientific-publications', scientificPublicationRoutes);
app.use('/api/grant-participation', grantParticipationRoutes);
app.use('/api/curator-activities', curatorActivityRoutes);
app.use('/api/expert-activity', expertActivityRoutes);
app.use("/api/rating", ratingRoutes);

// ✅ Обработка ошибок
app.use((err, req, res, next) => {
  console.error("Ошибка middleware:", err.message);
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: "Ошибка загрузки файла: " + err.message });
  }
  return res.status(500).json({ error: err.message });
});

// ✅ Обработка несуществующих маршрутов
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Маршрут не найден' });
});

// ✅ Запуск сервера
const PORT = process.env.PORT || 5000;

sequelize.sync({ alter: true })
  .then(() => {
    console.log("✅ Таблицы синхронизированы");
    app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Сервер запущен на порту ${PORT}`);
});
  })
  .catch((err) => {
    console.error("❌ Ошибка при синхронизации:", err);
  });

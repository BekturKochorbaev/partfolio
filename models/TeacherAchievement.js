const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TeacherAchievement = sequelize.define('TeacherAchievement', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  teacherId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id',
    },
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  date: {
    type: DataTypes.DATEONLY,
  },
  images: {
    type: DataTypes.TEXT,
    allowNull: true, // ← добавлено для хранения имени файла изображения
  },
}, {
  tableName: 'TeacherAchievements',
});

module.exports = TeacherAchievement;

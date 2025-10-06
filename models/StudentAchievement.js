const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const StudentAchievement = sequelize.define('StudentAchievement', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  teacherId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  title: DataTypes.STRING,
  description: DataTypes.TEXT,
  date: DataTypes.DATEONLY,
  eventType: DataTypes.STRING, // Конференция, Олимпиада, Проект и т.д.
  studentNames: DataTypes.ARRAY(DataTypes.STRING)
});

module.exports = StudentAchievement;

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const StudentMentorship = sequelize.define('StudentMentorship', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  teacherId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  activityType: DataTypes.STRING, // Конкурс, волонтёрство, благотворительность
  title: DataTypes.STRING,
  description: DataTypes.TEXT,
  date: DataTypes.DATEONLY,
  studentNames: DataTypes.ARRAY(DataTypes.STRING)
});

module.exports = StudentMentorship;

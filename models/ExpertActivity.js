const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ExpertActivity = sequelize.define('ExpertActivity', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  teacherId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  eventName: DataTypes.STRING,
  role: DataTypes.STRING, // член жюри, эксперт и т.д.
  participationDate: DataTypes.DATEONLY,
  organizer: DataTypes.STRING,

  // 🖼 Поле для изображений
  images: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },
}, {
  timestamps: true,
});

module.exports = ExpertActivity;

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const GrantParticipation = sequelize.define('GrantParticipation', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  teacherId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  projectName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: DataTypes.STRING,
  organization: DataTypes.STRING,
  startDate: DataTypes.DATEONLY,
  endDate: DataTypes.DATEONLY,
  status: DataTypes.STRING, // завершён / в процессе

  // ✅ Добавлено: изображения
  images: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true,
    defaultValue: [],
  },
}, {
  timestamps: true,
});

module.exports = GrantParticipation;

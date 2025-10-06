const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const QualificationImprovement = sequelize.define('QualificationImprovement', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  teacherId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  courseName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  organization: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  completionDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  documentFiles: { // Массив загруженных файлов (картинки сертификатов)
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true,
  },
}, {
  timestamps: true,
});

module.exports = QualificationImprovement;

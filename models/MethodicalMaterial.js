const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MethodicalMaterial = sequelize.define('MethodicalMaterial', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  teacherId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  documentFiles: { // ✅ Поддержка загрузки нескольких PDF
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true,
  },
}, {
  timestamps: true,
});

module.exports = MethodicalMaterial;
